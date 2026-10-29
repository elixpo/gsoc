"""Validate the exported GSoC site: crawl metadata, launch gate, links and content consistency.

Usage: python3 scripts/check_site.py out [--launched | --not-launched]

Without a flag, the expected gate state is read from NEXT_PUBLIC_SITE_LAUNCHED,
matching how the site itself is built.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

SITE_URL = "https://gsoc.elixpo.com"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
STATIC_ROUTES = ["/", "/ideas/", "/people/", "/contributor-guide/", "/proposal/", "/selection/", "/ai-policy/", "/timeline/", "/faq/", "/contact/"]
SIZES = {90, 175}
DIFFICULTIES = {"Easy", "Easy–Intermediate", "Intermediate", "Intermediate–Hard", "Hard"}
STATUS_BANNER = "Elixpo is preparing to apply as a GSoC 2027 mentoring organisation. Google has not yet announced GSoC 2027."
CAPACITY = "Elixpo is a first-time applicant and plans to mentor one contributor in 2027."
DISCLAIMER = "Not affiliated with or endorsed by Google."
CONTACT = "gsoc@elixpo.com"
# Claims the site must never make, and links it must not contain yet.
FORBIDDEN_TEXT = [
    re.compile(r"\bElixpo (is|has been|was) (accepted|selected)\b", re.I),
    re.compile(r"\baccepted (mentoring )?organi[sz]ation\b", re.I),
    re.compile(r"\d+\+ (contributors|projects|users|mentors)", re.I),
]
FORBIDDEN_LINKS = [re.compile(r"github\.com/elixpo/gsoc(?![\w.-])")]
NUMBER_WORDS = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, list[str]] = {}
        self.links: dict[str, str] = {}
        self.hrefs: list[str] = []
        self.srcs: list[str] = []
        self.ids: set[str] = set()
        self.lang = ""
        self.title = ""
        self.h1 = 0
        self.json_ld: list[str] = []
        self.imgs_without_alt = 0
        self._in_title = False
        self._in_json = False
        self._in_script = False
        self._text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"] or "")
        if tag == "html":
            self.lang = a.get("lang") or ""
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta.setdefault(key, []).append(a.get("content") or "")
        elif tag == "link" and a.get("rel"):
            self.links[a["rel"] or ""] = a.get("href") or ""
        elif tag == "title":
            self._in_title = True
        elif tag == "h1":
            self.h1 += 1
        elif tag == "a" and a.get("href"):
            self.hrefs.append(a["href"] or "")
        elif tag == "img":
            self.srcs.append(a.get("src") or "")
            if "alt" not in a:
                self.imgs_without_alt += 1
        elif tag == "script":
            self._in_script = True
            self._in_json = a.get("type") == "application/ld+json"

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        elif tag == "script":
            self._in_script = self._in_json = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data
        if self._in_json:
            self.json_ld.append(data)
        elif not self._in_script:
            self._text.append(data)

    @property
    def text(self) -> str:
        return re.sub(r"\s+", " ", html.unescape(" ".join(self._text)))


def first(meta: dict[str, list[str]], name: str) -> str:
    return meta.get(name, [""])[0]


def frontmatter(path: Path) -> dict[str, object]:
    source = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", source, re.S)
    assert match, f"{path}: no frontmatter"
    data: dict[str, object] = {}
    key = None
    for line in match.group(1).splitlines():
        item = re.match(r"^\s+-\s+(.*)$", line)
        if item and key:
            data[key].append(item.group(1).strip('"'))  # type: ignore[union-attr]
            continue
        pair = re.match(r"^([\w-]+):\s*(.*)$", line)
        if pair:
            key, value = pair.group(1), pair.group(2).strip()
            data[key] = [] if value in ("", "[]") else value.strip('"')
    return data


def people() -> dict[str, dict[str, object]]:
    source = Path("src/data/people.ts").read_text(encoding="utf-8")
    result = {}
    for block in re.findall(r"\{\s*name:(.*?)\n  \}", source, re.S):
        name = re.search(r'^\s*"([^"]+)"', block).group(1)  # type: ignore[union-attr]
        github = re.search(r'github: "([^"]+)"', block).group(1)  # type: ignore[union-attr]
        mentor = "isMentor: true" in block
        result[github] = {"name": name, "mentor": mentor}
    assert result, "Could not read src/data/people.ts"
    return result


def route_file(site: Path, route: str) -> Path:
    return site / route.lstrip("/") / "index.html" if route.endswith("/") else site / route.lstrip("/")


def check_site(site: Path, launched: bool) -> list[str]:
    errors: list[str] = []

    def expect(condition: bool, message: str) -> None:
        if not condition:
            errors.append(message)

    team = people()
    mentors = {handle: info for handle, info in team.items() if info["mentor"]}
    ideas = [frontmatter(path) for path in sorted(Path("content/ideas").glob("*.md")) if path.name != "README.md"]
    ideas.sort(key=lambda idea: int(str(idea["order"])))
    idea_routes = [f"/ideas/{idea['slug']}/" for idea in ideas]
    routes = STATIC_ROUTES + idea_routes

    # Launch gate: robots.txt
    robots = (site / "robots.txt").read_text(encoding="utf-8").casefold()
    expect("user-agent: *" in robots, "robots.txt has no wildcard user-agent")
    if launched:
        expect("allow: /" in robots and "disallow: /" not in robots, "robots.txt should allow crawling when launched")
        expect(f"sitemap: {SITE_URL}/sitemap.xml" in robots, "robots.txt omits the sitemap when launched")
    else:
        expect("disallow: /" in robots, "robots.txt must disallow everything before launch")
        expect("sitemap:" not in robots, "robots.txt must not advertise the sitemap before launch")

    # Sitemap
    sitemap = ET.parse(site / "sitemap.xml")
    urls = {node.text for node in sitemap.findall(f"{SITEMAP_NS}url/{SITEMAP_NS}loc") if node.text}
    expected_urls = {f"{SITE_URL}{route}" for route in routes}
    expect(urls == expected_urls, f"Sitemap mismatch. Missing: {sorted(expected_urls - urls)}; extra: {sorted(urls - expected_urls)}")

    # Idea content rules
    for idea in ideas:
        expect(int(str(idea["size_hours"])) in SIZES, f"{idea['slug']}: size must be 90 or 175")
        expect(idea["difficulty"] in DIFFICULTIES, f"{idea['slug']}: unknown difficulty {idea['difficulty']}")
        for role in ("primary_mentor", "backup_mentor"):
            expect(idea[role] in mentors, f"{idea['slug']}: {role} {idea[role]} is not a mentor in src/data/people.ts")

    parsed: dict[str, PageParser] = {}
    for route in routes + ["/404.html"]:
        path = route_file(site, route)
        if not path.is_file():
            errors.append(f"Missing page for {route}: {path}")
            continue
        page = PageParser()
        page.feed(path.read_text(encoding="utf-8"))
        parsed[route] = page
        canonical = f"{SITE_URL}{route}"
        robots_meta = ", ".join(page.meta.get("robots", []))

        expect(page.lang == "en", f"{route}: <html lang> is not en")
        expect(page.h1 == 1, f"{route}: expected exactly one <h1>, found {page.h1}")
        expect('href="#main"' in path.read_text(encoding="utf-8") and "main" in page.ids, f"{route}: missing skip link target")
        expect(page.imgs_without_alt == 0, f"{route}: image without alt attribute")
        expect(STATUS_BANNER in page.text, f"{route}: status banner missing")
        expect(DISCLAIMER in page.text and CONTACT in page.text, f"{route}: footer disclaimer or contact missing")
        for pattern in FORBIDDEN_TEXT:
            expect(not pattern.search(page.text), f"{route}: forbidden claim matches {pattern.pattern!r}")
        for href in page.hrefs:
            for pattern in FORBIDDEN_LINKS:
                expect(not pattern.search(href), f"{route}: link to a private repository: {href}")

        types = set()
        for block in page.json_ld:
            try:
                data = json.loads(block)
            except json.JSONDecodeError as error:
                errors.append(f"{route}: invalid JSON-LD: {error}")
                continue
            types.add(data.get("@type"))
        expect("Organization" in types, f"{route}: Organization JSON-LD missing")

        if route == "/404.html":
            expect("noindex" in robots_meta, "404 page must be noindex")
            continue

        expect(bool(page.title.strip()), f"{route}: missing <title>")
        if route != "/":
            expect(page.title.strip().endswith("· Elixpo GSoC"), f"{route}: title does not use the site template: {page.title!r}")
        expect(page.links.get("canonical") == canonical, f"{route}: canonical is {page.links.get('canonical')!r}, expected {canonical}")
        expect(bool(first(page.meta, "description")), f"{route}: missing description")
        expect(first(page.meta, "og:url") == canonical, f"{route}: og:url is {first(page.meta, 'og:url')!r}")
        expect(first(page.meta, "twitter:card") == "summary_large_image", f"{route}: missing large Twitter card")
        image = first(page.meta, "og:image")
        expect(image.startswith(SITE_URL) and (site / image.removeprefix(SITE_URL).lstrip("/")).is_file(), f"{route}: og:image not exported: {image!r}")
        if launched:
            expect("noindex" not in robots_meta and "index" in robots_meta, f"{route}: should be indexable when launched (robots={robots_meta!r})")
        else:
            expect(robots_meta == "noindex, nofollow", f"{route}: must be noindex, nofollow before launch (robots={robots_meta!r})")

        if route == "/ideas/":
            expect("ItemList" in types, "/ideas/: ItemList JSON-LD missing")
        if route in idea_routes:
            expect("BreadcrumbList" in types, f"{route}: BreadcrumbList JSON-LD missing")
        if route == "/faq/":
            expect("FAQPage" in types, "/faq/: FAQPage JSON-LD missing")

    # Internal links and assets resolve
    for route, page in parsed.items():
        for ref in page.hrefs + page.srcs:
            if not ref.startswith("/") or ref.startswith("//") or ref.startswith("/_next/"):
                continue
            target = ref.split("#")[0].split("?")[0]
            expect(route_file(site, target).is_file(), f"{route}: broken internal link {ref}")
            if target.endswith("/") is False and "." not in target.rsplit("/", 1)[-1]:
                errors.append(f"{route}: internal link without trailing slash {ref}")

    # Consistency across pages
    for route in ("/", "/ideas/", "/faq/"):
        if route in parsed:
            expect(CAPACITY in parsed[route].text, f"{route}: capacity statement missing")
    listing, home, faq, people_page = (parsed.get(r) for r in ("/ideas/", "/", "/faq/", "/people/"))
    for idea in ideas:
        primary, backup = team[str(idea["primary_mentor"])]["name"], team[str(idea["backup_mentor"])]["name"]
        facts = [str(idea["title"]), f"{idea['size_hours']} hours", str(idea["difficulty"]), str(primary), str(backup)]
        for where, page in (("/ideas/", listing), ("/", home), (f"/ideas/{idea['slug']}/", parsed.get(f"/ideas/{idea['slug']}/"))):
            if page:
                for fact in facts:
                    expect(fact in page.text, f"{where}: missing {fact!r} for idea {idea['slug']}")
        if people_page:
            expect(str(idea["title"]) in people_page.text, f"/people/: idea {idea['slug']} not listed under its mentors")
    if faq:
        for info in mentors.values():
            expect(str(info["name"]) in faq.text, f"/faq/: mentor {info['name']} missing from the FAQ")
        counts = {size: sum(1 for idea in ideas if int(str(idea["size_hours"])) == size) for size in SIZES}
        sentence = f"{NUMBER_WORDS[counts[175]].capitalize()} ideas are 175 hours and {NUMBER_WORDS[counts[90]]} are 90 hours"
        expect(sentence in faq.text, f"/faq/: size counts out of date; expected {sentence!r}")
    if people_page:
        for info in team.values():
            expect(str(info["name"]) in people_page.text, f"/people/: {info['name']} missing")
    if home:
        expect(f"See the {len(ideas)} project ideas" in home.text, "/: idea count in the call to action is wrong")

    readme = Path("content/README.md").read_text(encoding="utf-8")
    for idea in ideas:
        primary, backup = team[str(idea["primary_mentor"])]["name"], team[str(idea["backup_mentor"])]["name"]
        row = f"| {idea['theme']} | {idea['size_hours']} h | {idea['difficulty']} | {primary} / {backup} |"
        expect(f"[{idea['title']}](ideas/{idea['slug']}.md) {row}" in readme, f"content/README.md: ideas table row for {idea['slug']} is out of date")

    for name in ("favicon.ico", "robots.txt", "sitemap.xml", "manifest.webmanifest", "_headers", "404.html", "elixpo-logo.png"):
        expect((site / name).is_file(), f"Missing public file: {name}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("site", type=Path, help="Exported Next.js site directory")
    gate = parser.add_mutually_exclusive_group()
    gate.add_argument("--launched", action="store_true", help="Expect a launched (indexable) build")
    gate.add_argument("--not-launched", action="store_true", help="Expect a pre-launch (noindex) build")
    args = parser.parse_args()
    launched = args.launched or (not args.not_launched and os.environ.get("NEXT_PUBLIC_SITE_LAUNCHED") == "true")
    try:
        errors = check_site(args.site, launched)
    except (AssertionError, OSError, ET.ParseError, KeyError) as error:
        errors = [str(error)]
    if errors:
        print(f"Site check failed ({'launched' if launched else 'pre-launch'} build):", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1
    print(f"Site check passed ({'launched' if launched else 'pre-launch'} build): crawl metadata, launch gate, links and content are consistent")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
