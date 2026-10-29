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
import struct
import sys
from datetime import datetime, timezone
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

SITE_URL = "https://gsoc.elixpo.com"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
STATIC_ROUTES = ["/", "/ideas/", "/people/", "/contributor-guide/", "/proposal/", "/selection/", "/ai-policy/", "/timeline/", "/faq/", "/glossary/", "/contact/", "/about/"]
SIZES = {90, 175}
DIFFICULTIES = {"Easy", "Intermediate", "Hard"}
STATUS_BANNER = "Elixpo is preparing to apply as a GSoC 2027 mentoring organisation. Google has not yet announced GSoC 2027."
CAPACITY = "Elixpo is a first-time applicant and plans to mentor one contributor in 2027."
# Google's brand rules: the trademark notice appears in the footer of every page.
DISCLAIMER = (
    "Google Summer of Code and the GSoC logo are trademarks of Google LLC. Elixpo is preparing to apply as a "
    "mentoring organisation and is not affiliated with or endorsed by Google."
)
GSOC_LOGO_SRC = "/brand/gsoc/GSoC-Horizontal.png"
GSOC_LOGO_ALT = "Google Summer of Code logo"
GSOC_LOGO_LABEL = "Elixpo is preparing to apply to"
GSOC_BRAND_FILES = ["GSoC-Horizontal.svg", "GSoC-Horizontal.png", "GSoC-Vertical.svg", "GSoC-Vertical.png", "GSoC-icon-192.png"]
# Evidence for the history on /about/ (from elixpo/content/history.json). Each must be linked.
HISTORY_EVIDENCE = [
    "https://github.com/elixpo/octabit",
    "https://github.com/elixpo",
    "https://github.com/elixpo/elixpo_chapter/pulls?q=is%3Apr+is%3Amerged+label%3Ahacktoberfest+merged%3A2024-10-01..2024-10-31",
    "https://github.com/elixpo/elixpo_chapter/pulls?q=is%3Apr+is%3Amerged+label%3Ahacktoberfest+merged%3A2025-10-01..2025-10-31",
    "https://github.com/orgs/elixpo/repositories",
    "https://elixpo.com/partnerships",
]
CONTACT = "gsoc@elixpo.com"
# Claims the site must never make, and links it must not contain yet.
FORBIDDEN_TEXT = [
    re.compile(r"\bElixpo (is|has been|was) (accepted|selected)\b", re.I),
    re.compile(r"\baccepted (mentoring )?organi[sz]ation\b", re.I),
    re.compile(r"\d+\+ (contributors|projects|users|mentors)", re.I),
    re.compile(r"\bElixpo\s*[×xX]\s*(GSoC|Google)", re.I),
    re.compile(r"\b(GSoC|Google Summer of Code|Google)( 2027)? partner", re.I),
    re.compile(r"\bglobal community\b", re.I),
]
FORBIDDEN_LINKS = [re.compile(r"github\.com/elixpo/gsoc(?![\w.-])")]
# Main navigation (src/data/site.ts NAV), in order of importance; Contact is last, as a button.
# Each of these pages must mark its own link with aria-current="page".
NAV_ROUTES = ["/ideas/", "/contributor-guide/", "/proposal/", "/timeline/", "/people/", "/faq/", "/contact/"]
NOT_IN_NAV = ["/selection/", "/ai-policy/", "/glossary/", "/about/"]
GSOC_TIMELINE_URL = "https://developers.google.com/open-source/gsoc/timeline"
GSOC_URL = "https://summerofcode.withgoogle.com/"
TIMELINE_PHASES = ["Organisations apply", "Organisations are announced", "Contributors apply", "Community bonding", "Coding", "Evaluations"]
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


def png_size(path: Path) -> tuple[int, int]:
    header = path.read_bytes()[:24]
    assert header[1:4] == b"PNG" and header[12:16] == b"IHDR", f"{path} is not a PNG file"
    return struct.unpack(">II", header[16:24])


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
    raw: dict[str, str] = {}
    for route in routes + ["/404.html"]:
        path = route_file(site, route)
        if not path.is_file():
            errors.append(f"Missing page for {route}: {path}")
            continue
        source = path.read_text(encoding="utf-8")
        page = PageParser()
        page.feed(source)
        parsed[route] = page
        raw[route] = source
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
            if data.get("@type") == "Organization":
                expect(data.get("url") == "https://elixpo.com" and bool(data.get("logo")) and data.get("foundingDate") == "2024-02-24"
                       and "https://github.com/elixpo" in data.get("sameAs", [])
                       and any(point.get("email") == CONTACT for point in data.get("contactPoint", [])),
                       f"{route}: Organization JSON-LD lacks url, logo, sameAs, foundingDate or contactPoint email")
        expect("Organization" in types, f"{route}: Organization JSON-LD missing")
        expect("WebSite" in types, f"{route}: WebSite JSON-LD missing")
        footer_html = re.search(r"<footer.*?</footer>", source, re.S)
        expect(bool(footer_html) and DISCLAIMER in html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", footer_html.group(0)))),
               f"{route}: GSoC trademark notice missing from the footer")

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
        image_file = site / image.removeprefix(SITE_URL).lstrip("/")
        expect(image.startswith(SITE_URL) and image_file.is_file(), f"{route}: og:image not exported: {image!r}")
        if image_file.is_file():
            declared = (first(page.meta, "og:image:width"), first(page.meta, "og:image:height"))
            actual = png_size(image_file)
            expect(declared == (str(actual[0]), str(actual[1])), f"{route}: og:image declares {declared[0]}x{declared[1]} but {image_file.name} is {actual[0]}x{actual[1]}")
        expect("/brand/gsoc/" not in image and "/brand/gsoc/" not in first(page.meta, "twitter:image"), f"{route}: the GSoC logo must not be used as a social card")
        expect(bool(first(page.meta, "twitter:title")) and bool(first(page.meta, "twitter:description")) and bool(first(page.meta, "twitter:image")), f"{route}: Twitter title, description or image missing")
        expect(bool(first(page.meta, "og:title")) and bool(first(page.meta, "og:description")), f"{route}: Open Graph title or description missing")
        expect(bool(first(page.meta, "theme-color")), f"{route}: theme-color missing")
        for rel in ("icon", "apple-touch-icon", "manifest"):
            expect(bool(page.links.get(rel)), f"{route}: <link rel={rel}> missing")
            expect("/brand/gsoc/" not in page.links.get(rel, ""), f"{route}: the GSoC logo must not be used as {rel}")
        verification = os.environ.get("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", "").strip()
        if verification:
            expect(first(page.meta, "google-site-verification") == verification, f"{route}: Google site verification meta missing")
        else:
            expect("google-site-verification" not in page.meta, f"{route}: Google site verification meta present without NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION")
        if route != "/":
            expect("BreadcrumbList" in types, f"{route}: BreadcrumbList JSON-LD missing")
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
        if route == "/about/":
            expect("AboutPage" in types, "/about/: AboutPage JSON-LD missing")

    # Navigation: "What next?" block, footer site map, current page in the main nav
    for route in routes:
        source, page = raw.get(route), parsed.get(route)
        if not source or not page:
            continue
        expect('id="what-next"' in source and "What next?" in page.text, f"{route}: 'What next?' block missing")
        what_next = re.search(r'<nav[^>]*class="what-next".*?</nav>', source, re.S)
        expect(bool(what_next and re.search(r'href="/', what_next.group(0))), f"{route}: 'What next?' block has no internal links")
        footer = re.search(r'<footer.*?</footer>', source, re.S)
        footer_links = set(re.findall(r'href="([^"]+)"', footer.group(0))) if footer else set()
        for target in STATIC_ROUTES:
            expect(target in footer_links, f"{route}: footer site map does not link to {target}")
        main_nav = re.search(r'<nav[^>]*aria-label="Main".*?</nav>', source, re.S)
        expect(bool(main_nav), f"{route}: main navigation missing")
        if main_nav:
            nav_hrefs = re.findall(r'href="([^"]+)"', main_nav.group(0))
            expect(nav_hrefs == NAV_ROUTES, f"{route}: main navigation order is {nav_hrefs}, expected {NAV_ROUTES}")
            expect(re.search(r'class="nav-contact"[^>]*>\s*<a[^>]*href="/contact/"', main_nav.group(0)) is not None, f"{route}: Contact is not the button at the end of the main navigation")
            for target in NOT_IN_NAV:
                expect(f'href="{target}"' not in main_nav.group(0), f"{route}: {target} belongs in the footer, not the main navigation")
        if main_nav and route in NAV_ROUTES:
            expect(re.search(rf'<a[^>]*href="{re.escape(route)}"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="{re.escape(route)}"', main_nav.group(0)) is not None,
                   f"{route}: main navigation does not mark the current page with aria-current")
        if main_nav and route in idea_routes:
            expect('aria-current="true"' in main_nav.group(0), f"{route}: 'Ideas' is not marked as the current section")

    # Home page: "Start here" path and the GSoC explainer
    if "/" in raw:
        source, text = raw["/"], parsed["/"].text
        start = re.search(r'id="start-here".*?</section>', source, re.S)
        expect(bool(start), "/: 'Start here' section missing")
        if start:
            for target in ("/ideas/", "/contributor-guide/", "/proposal/"):
                expect(f'href="{target}"' in start.group(0), f"/: 'Start here' does not link to {target}")
        expect("What is Google Summer of Code?" in text and f'href="{GSOC_URL}"' in source, "/: 'What is Google Summer of Code?' section or official link missing")

    # Home page: the GSoC logo, unmodified, labelled and separate from the Elixpo mark
    if "/" in raw:
        source = raw["/"]
        hero = re.search(r'<header class="home-hero".*?</header>', source, re.S)
        expect(bool(hero), "/: home hero missing")
        if hero:
            logo = re.search(r'<img[^>]*src="' + re.escape(GSOC_LOGO_SRC) + r'"[^>]*>', hero.group(0))
            expect(bool(logo) and f'alt="{GSOC_LOGO_ALT}"' in (logo.group(0) if logo else ""), "/: GSoC logo with the right alt text missing from the hero")
            figure = re.search(r'<figure class="gsoc-mark">.*?</figure>', hero.group(0), re.S)
            expect(bool(figure and GSOC_LOGO_LABEL in figure.group(0)), f"/: GSoC logo is not labelled {GSOC_LOGO_LABEL!r}")
            expect(bool(figure) and "icon-192.png" not in figure.group(0) and "elixpo-logo" not in figure.group(0), "/: the GSoC logo must not share a lockup with the Elixpo mark")
        expect("Our track record" in parsed["/"].text and 'href="/about/"' in source, "/: 'Our track record' section or link to /about/ missing")
    for name in GSOC_BRAND_FILES:
        path = site / "brand" / "gsoc" / name
        expect(path.is_file(), f"Missing GSoC brand file: {name}")
        if path.is_file():
            head = path.read_bytes()[:256]
            expect(head.startswith(b"\x89PNG") if name.endswith(".png") else b"<svg" in head, f"{name} is not a real {name.rsplit('.', 1)[-1].upper()} file")

    # About page: every history step links to its evidence; date precision is stated
    if "/about/" in raw:
        source, text = raw["/about/"], parsed["/about/"].text
        for url in HISTORY_EVIDENCE:
            expect(f'href="{html.escape(url)}"' in source or f'href="{url}"' in source, f"/about/: history evidence link missing: {url}")
        expect(text.count("Date precision:") >= 6, "/about/: date precision missing from history entries")
        expect("Mentoring experience" in text, "/about/: 'Mentoring experience' section missing")

    # People page: each role is a chip in a list
    if "/people/" in raw:
        source = raw["/people/"]
        roles_source = Path("src/data/people.ts").read_text(encoding="utf-8")
        for roles in re.findall(r"roles: \[([^\]]*)\]", roles_source):
            for role in re.findall(r'"([^"]+)"', roles):
                expect(re.search(r'<ul class="chips[^"]*"[^>]*>(?:(?!</ul>).)*<li class="chip">' + re.escape(html.escape(role, quote=False)) + "</li>", source, re.S) is not None,
                       f"/people/: role {role!r} is not shown as a chip")
        for role in ("Primary mentor", "Backup mentor"):
            expect(f'<li class="chip">{role}</li>' in source, f"/people/: {role!r} chip missing")

    # Timeline: usual phases, no dates, link to Google's timeline
    if "/timeline/" in raw:
        text = parsed["/timeline/"].text
        for phase in TIMELINE_PHASES:
            expect(phase in text, f"/timeline/: phase {phase!r} missing")
        expect(f'href="{GSOC_TIMELINE_URL}"' in raw["/timeline/"], "/timeline/: link to Google's official timeline missing")

    # Proposal page links to the pages that left the main navigation
    if "/proposal/" in raw:
        for target in ("/selection/", "/ai-policy/"):
            body = re.search(r"<main.*?</main>", raw["/proposal/"], re.S)
            expect(bool(body and f'href="{target}"' in body.group(0)), f"/proposal/: contextual link to {target} missing")

    # Idea pages: breadcrumb, plain summary, start box, previous / next links
    for index, idea in enumerate(ideas):
        route = idea_routes[index]
        source, page = raw.get(route), parsed.get(route)
        if not source or not page:
            continue
        crumb = re.search(r'<nav[^>]*aria-label="Breadcrumb".*?</nav>', source, re.S)
        expect(bool(crumb and 'href="/"' in crumb.group(0) and 'href="/ideas/"' in crumb.group(0) and 'aria-current="page"' in crumb.group(0)),
               f"{route}: breadcrumb (Home > Ideas > title) missing")
        expect(f"In short: {idea['in_short']}" in page.text, f"{route}: 'In short' summary missing")
        expect("Why this matters" in page.text and "Words used on this page" in page.text, f"{route}: 'Why this matters' or 'Words used on this page' missing")
        expect('id="how-to-start"' in source and "How to start on this idea" in page.text and f'href="{idea["repository"]}"' in source,
               f"{route}: 'How to start on this idea' box missing or without the repository link")
        pager = re.search(r'<nav[^>]*aria-label="More ideas".*?</nav>', source, re.S)
        expect(bool(pager), f"{route}: previous / next idea links missing")
        if pager:
            if index > 0:
                expect(f'href="{idea_routes[index - 1]}"' in pager.group(0), f"{route}: link to the previous idea missing")
            if index < len(ideas) - 1:
                expect(f'href="{idea_routes[index + 1]}"' in pager.group(0), f"{route}: link to the next idea missing")

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

    for name in ("favicon.ico", "robots.txt", "sitemap.xml", "manifest.webmanifest", "_headers", "404.html", "elixpo-logo.png",
                 "apple-touch-icon.png", "icon-192.png", "icon-512.png", "humans.txt", ".well-known/security.txt"):
        expect((site / name).is_file(), f"Missing public file: {name}")

    # Sitemap entries carry lastmod
    for node in sitemap.findall(f"{SITEMAP_NS}url"):
        expect(node.find(f"{SITEMAP_NS}lastmod") is not None, f"sitemap.xml: {node.findtext(f'{SITEMAP_NS}loc')} has no lastmod")

    # Manifest uses the Elixpo mark only
    if (site / "manifest.webmanifest").is_file():
        manifest = json.loads((site / "manifest.webmanifest").read_text(encoding="utf-8"))
        icons = [icon.get("src", "") for icon in manifest.get("icons", [])]
        expect(bool(icons) and not any("/brand/gsoc/" in icon for icon in icons), "manifest.webmanifest: icons missing or use the GSoC logo")

    # security.txt (RFC 9116)
    security = site / ".well-known" / "security.txt"
    if security.is_file():
        fields = dict(line.split(": ", 1) for line in security.read_text(encoding="utf-8").splitlines() if ": " in line)
        expect(fields.get("Contact") == f"mailto:{CONTACT}", "security.txt: Contact must be mailto:gsoc@elixpo.com")
        expect(fields.get("Canonical") == f"{SITE_URL}/.well-known/security.txt", "security.txt: wrong Canonical")
        try:
            expires = datetime.fromisoformat(fields.get("Expires", "").replace("Z", "+00:00"))
            expect(expires > datetime.now(timezone.utc), "security.txt: Expires is in the past")
        except ValueError:
            errors.append("security.txt: Expires missing or not an ISO 8601 date")

    # No decorative ::before / ::after pseudo-elements in the built CSS
    for css in (site / "_next").rglob("*.css"):
        content = css.read_text(encoding="utf-8")
        expect(not re.search(r"::?(before|after)\b", content), f"{css.name}: uses ::before/::after pseudo-elements")

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
