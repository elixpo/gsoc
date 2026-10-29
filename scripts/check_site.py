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
STATIC_ROUTES = ["/", "/ideas/", "/projects/", "/mentors/", "/operations/", "/contributor-guide/", "/proposal/", "/selection/", "/ai-policy/", "/timeline/", "/faq/", "/glossary/", "/contact/", "/agenda/", "/why-elixpo/", "/about/",
                 "/privacy/", "/terms/", "/code-of-conduct/", "/contributing/", "/agreements/"]
# Footer legal and community row (src/data/site.ts LEGAL_PAGES), exactly in this order, on every page.
LEGAL_ROUTES = ["/privacy/", "/terms/", "/code-of-conduct/", "/contributing/", "/agreements/"]
LEGAL_LABELS = ["Privacy", "Terms of service", "Code of Conduct", "Contributing", "Agreements"]
SIZES = {90, 175}
DIFFICULTIES = {"Easy", "Intermediate", "Hard"}
STATUS_BANNER = (
    "Elixpo is applying to be a mentoring organisation for Google Summer of Code 2027. "
    "Google announces accepted organisations after the application period."
)
CAPACITY = "In 2027 we plan to mentor one contributor."
HOME_CAPACITY = "In 2027 we plan to mentor one contributor, with a primary and a backup mentor on every project."
# Home hero stats row: numerals and labels, in order (src/app/page.tsx).
HOME_STATS = [("1", "contributor in 2027"), ("6", "project ideas"), ("2", "mentors on every idea"), ("5", "participating projects")]
# Credential strip under the home hero: verified facts from elixpo/content/history.json.
HOME_CREDENTIALS = [("Hacktoberfest 2024 & 2025", "maintainer-led participation"),
                    ("47 pull requests merged", "Hacktoberfest 2025, from 24 GitHub accounts"),
                    ("Organisation since 2024", "github.com/elixpo"),
                    ("Two mentors per idea", "primary and backup")]
# Analytics, tracking and cookie code. If any appears in the build, /privacy/ must not deny it.
TRACKING_PATTERNS = [re.compile(p, re.I) for p in (
    r"googletagmanager\.com", r"google-analytics\.com", r"\bgtag\(", r"plausible\.io", r"cloudflareinsights\.com",
    r"umami\.(is|js)", r"posthog", r"mixpanel", r"hotjar", r"segment\.(com|io)", r"matomo", r"clarity\.ms",
    r"document\.cookie\s*=", r"\blocalStorage\.setItem", r"\bsessionStorage\.setItem")]
PRIVACY_DENIALS = {
    "cookies": re.compile(r"does not set cookies|no cookies", re.I),
    "analytics": re.compile(r"no analytics|contains no analytics", re.I),
}
PRIVACY_EFFECTIVE = "Effective date: 29 October 2026."
# Google's brand rules: the trademark notice appears in the footer of every page.
DISCLAIMER = (
    "Google Summer of Code and the GSoC logo are trademarks of Google LLC. Elixpo is applying as a "
    "mentoring organisation and is not affiliated with or endorsed by Google."
)
GSOC_LOGO_SRC = "/brand/gsoc/GSoC-Horizontal.png"
GSOC_LOGO_ALT = "Google Summer of Code logo"
GSOC_LOGO_LABEL = "Elixpo is applying to"
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
# GitHub Discussions for the programme open only once Google announces the GSoC 2027 dates (src/data/site.ts).
DISCUSSIONS_NOTE = "GitHub Discussions for GSoC 2027 will open once Google announces the programme dates."
# Wording that presents Discussions as open now; checked in page text.
DISCUSSIONS_AS_OPEN = [
    re.compile(r"\b(ask|post|discuss|share|introduce yourself|open a discussion)\b[^.]{0,60}\bin (GitHub )?Discussions\b", re.I),
    re.compile(r"Ask in GitHub Discussions", re.I),
]
# Claims the site must never make, and links it must not contain yet.
FORBIDDEN_TEXT = [
    re.compile(r"\bElixpo (is|has been|was) (accepted|selected)\b", re.I),
    re.compile(r"\b(an|our|is an?) accepted (mentoring )?organi[sz]ation\b", re.I),
    re.compile(r"\bElixpo (is|has been) (participating|taking part) in\b", re.I),
    re.compile(r"\d+\+ (contributors|projects|users|mentors)", re.I),
    re.compile(r"\bElixpo\s*[×xX]\s*(GSoC|Google)", re.I),
    re.compile(r"\b(GSoC|Google Summer of Code|Google)( 2027)? partner", re.I),
    re.compile(r"\bglobal community\b", re.I),
]
# Self-deprecating framing the site no longer uses, checked in the raw HTML (text, metadata and JSON-LD).
FORBIDDEN_FRAMING = [
    re.compile(r"first[- ]time", re.I),
    re.compile(r"\bnew (mentoring )?organi[sz]ation\b", re.I),
    re.compile(r"\bnot (yet )?(mentored|taken part|participated) in\b", re.I),
    re.compile(r"\bpreparing to apply\b", re.I),
]
FORBIDDEN_LINKS = [re.compile(r"github\.com/elixpo/gsoc(?![\w.-])")]
# Main navigation (src/data/site.ts NAV), exactly in this order; Contact is last, as a button.
# Each of these pages must mark its own link with aria-current="page".
NAV_ROUTES = ["/ideas/", "/projects/", "/proposal/", "/timeline/", "/mentors/", "/faq/", "/contributor-guide/", "/contact/"]
NAV_LABELS = ["Ideas", "Projects", "Proposal", "Timeline", "Mentors", "FAQ", "Get involved", "Contact"]
NOT_IN_NAV = ["/selection/", "/ai-policy/", "/glossary/", "/agenda/", "/about/", "/operations/", "/why-elixpo/"]
# The five codebases on /projects/ (content/projects/*.md).
PROJECT_REPOS = ["blogs.elixpo", "sketch.elixpo", "crumb.elixpo", "opensource.elixpo", "oreo"]
IDEA_SECTIONS = ["Description", "Expected outcomes", "Stretch goals", "Out of scope", "How success is measured", "Material",
                 "Warm-up tasks", "Skills, size and mentors", "Terms used on this page"]
GSOC_TIMELINE_URL = "https://developers.google.com/open-source/gsoc/timeline"
GSOC_URL = "https://summerofcode.withgoogle.com/"
# Sections a page must keep, by heading id (content/pages/*.md).
REQUIRED_SECTIONS = {
    "/contributor-guide/": ["why-contribute-to-elixpo", "what-each-project-is-for", "step-by-step", "what-we-expect-from-you",
                            "what-you-can-expect-from-us", "communication-channels"],
    "/agenda/": ["what-elixpo-is", "what-we-want-google-summer-of-code-to-achieve", "what-we-ship-in-public",
                 "how-we-decide-what-to-approve", "money-and-commercial-interests", "care-for-contributors"],
    "/operations/": ["who-does-what", "the-programme-phase-by-phase", "communication", "mentor-operations", "evaluations",
                     "escalation-and-conduct", "after-the-programme", "what-we-publish", "what-this-is-based-on"],
}
# How we run the programme: linked from these pages, and pointing to Google's rules and support address.
# Why Elixpo: each answer links its evidence; these must stay.
WHY_ELIXPO_LINKS = ["https://github.com/orgs/elixpo/repositories", "/projects/", "/mentors/", "/ideas/", "/contributor-guide/", "/selection/",
                    "/operations/", "/ai-policy/", "/agenda/#money-and-commercial-interests", "/about/#mentoring-experience", "/agreements/",
                    "mailto:gsoc@elixpo.com", HISTORY_EVIDENCE[3]]
OPERATIONS_LINKED_FROM = ["/mentors/", "/contributor-guide/", "/agenda/"]
OPERATIONS_LINKS = [GSOC_TIMELINE_URL, "https://developers.google.com/open-source/gsoc/help/responsibilities",
                    "https://summerofcode.withgoogle.com/rules", "mailto:gsoc-support@google.com", "/code-of-conduct/", "/agreements/"]
# Claims about money the evidence does not support (some hosted services have paid plans).
FORBIDDEN_COMMERCIAL = [
    re.compile(r"\bnothing (here |in elixpo )?is commercial\b", re.I),
    re.compile(r"\bElixpo (has|offers) no paid\b", re.I),
    re.compile(r"\b(every|all) (Elixpo )?(tools?|services?) (is|are) free\b", re.I),
]
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
    # Participating projects (content/projects/*.md): product site and elixpo.com page, linked from /projects/ and each idea
    projects = [frontmatter(path) for path in sorted(Path("content/projects").glob("*.md"))]
    project_of = {str(project["repository"]): project for project in projects}
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
        for pattern in FORBIDDEN_FRAMING:
            expect(not pattern.search(html.unescape(source)), f"{route}: framing the site no longer uses matches {pattern.pattern!r}")
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
        legal = re.search(r'<nav[^>]*aria-labelledby="footer-legal-heading".*?</nav>', footer_html.group(0) if footer_html else "", re.S)
        legal_links = re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', legal.group(0) if legal else "", re.S)
        expect([href for href, _ in legal_links] == LEGAL_ROUTES and [html.unescape(re.sub(r"<[^>]+>", "", label)).strip() for _, label in legal_links] == LEGAL_LABELS,
               f"{route}: footer legal links are {legal_links}, expected {list(zip(LEGAL_ROUTES, LEGAL_LABELS))}")
        footer_source = footer_html.group(0) if footer_html else ""
        footer_text = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", footer_source)))
        expect(f'href="mailto:{CONTACT}"' in footer_source, f"{route}: footer lacks the mailto:{CONTACT} link")
        expect(DISCUSSIONS_NOTE in footer_text, f"{route}: footer lacks the note that GitHub Discussions open once Google announces the dates")
        for pattern in DISCUSSIONS_AS_OPEN:
            expect(not pattern.search(page.text), f"{route}: presents GitHub Discussions as open now ({pattern.pattern!r})")

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
        if route in ("/faq/", "/why-elixpo/"):
            expect("FAQPage" in types, f"{route}: FAQPage JSON-LD missing")
        if route == "/about/":
            expect("AboutPage" in types, "/about/: AboutPage JSON-LD missing")
        if route == "/projects/":
            expect("CollectionPage" in types, "/projects/: CollectionPage JSON-LD missing")
            for block in page.json_ld:
                data = json.loads(block)
                if data.get("@type") == "CollectionPage":
                    items = [entry.get("item", {}) for entry in data.get("mainEntity", {}).get("itemListElement", [])]
                    repos = [item.get("codeRepository") for item in items if item.get("@type") == "SoftwareSourceCode" and item.get("programmingLanguage")]
                    expect(repos == [f"https://github.com/elixpo/{repo}" for repo in PROJECT_REPOS],
                           f"/projects/: SoftwareSourceCode items with codeRepository and programmingLanguage are {repos}")

    # Required sections and links to the agenda
    for route, ids in REQUIRED_SECTIONS.items():
        source = raw.get(route, "")
        for section in ids:
            expect(f'id="{section}"' in source, f"{route}: section #{section} missing")
    if "/contributor-guide/" in raw:
        expect('href="/agenda/"' in raw["/contributor-guide/"], "/contributor-guide/: does not link to /agenda/")
    if "/" in raw:
        expect('href="/agenda/"' in raw["/"] and "Read our agenda" in parsed["/"].text, "/: 'Read our agenda' link missing")
    if "/" in raw:
        actions = re.search(r'<div class="actions">(.*?)</div>', raw["/"], re.S)
        expect(bool(actions) and re.findall(r'href="([^"]+)"', actions.group(1) if actions else "")[-1:] == ["/why-elixpo/"]
               and "Why Elixpo for GSoC" in (actions.group(1) if actions else ""), "/: hero action 'Why Elixpo for GSoC' missing or not last")
    if "/why-elixpo/" in raw:
        source = raw["/why-elixpo/"]
        for target in WHY_ELIXPO_LINKS:
            expect(f'href="{target}"' in source, f"/why-elixpo/: evidence link missing: {target}")
        expect(len(re.findall(r'<h2 id="q-\d+">', source)) >= 10, "/why-elixpo/: fewer than ten questions")
    for route in OPERATIONS_LINKED_FROM:
        if route in raw:
            body = re.search(r"<main.*?</main>", raw[route], re.S)
            expect(bool(body and 'href="/operations/"' in body.group(0)), f"{route}: does not link to /operations/")
    if "/operations/" in raw:
        source, text = raw["/operations/"], parsed["/operations/"].text
        for target in OPERATIONS_LINKS:
            expect(f'href="{target}"' in source, f"/operations/: link missing: {target}")
        expect("Weekly progress report template" in text and re.search(r"<pre><code[^>]*>Week N", source) is not None,
               "/operations/: weekly progress report template missing")
    for route, page in parsed.items():
        for pattern in FORBIDDEN_COMMERCIAL:
            expect(not pattern.search(page.text), f"{route}: unsupported claim about money matches {pattern.pattern!r}")

    # Navigation: "What next?" block, footer site map, current page in the main nav
    for route in routes:
        source, page = raw.get(route), parsed.get(route)
        if not source or not page:
            continue
        # TL;DR box near the top of every page: a mono label and 3-5 short lines (content/**/*.md `tldr:`)
        tldr = re.search(r'<aside class="content tldr-wrap"[^>]*>\s*<div class="tldr">\s*<p class="tldr-label">TL;DR</p>\s*<ul>(.*?)</ul>', source, re.S)
        items = re.findall(r"<li>", tldr.group(1)) if tldr else []
        expect(bool(tldr) and 3 <= len(items) <= 5, f"{route}: TL;DR box missing or not 3-5 items (found {len(items)})")
        if tldr:
            expect(source.index(tldr.group(0)) < source.find('id="what-next"'), f"{route}: TL;DR box must come before the 'Next steps' block")
        expect('id="what-next"' in source and "Next steps" in page.text, f"{route}: 'Next steps' block missing")
        what_next = re.search(r'<nav[^>]*class="what-next".*?</nav>', source, re.S)
        expect(bool(what_next and re.search(r'href="/', what_next.group(0))), f"{route}: 'Next steps' block has no internal links")
        footer = re.search(r'<footer.*?</footer>', source, re.S)
        footer_links = set(re.findall(r'href="([^"]+)"', footer.group(0))) if footer else set()
        for target in STATIC_ROUTES:
            expect(target in footer_links, f"{route}: footer site map does not link to {target}")
        main_nav = re.search(r'<nav[^>]*aria-label="Main".*?</nav>', source, re.S)
        expect(bool(main_nav), f"{route}: main navigation missing")
        if main_nav:
            nav_hrefs = re.findall(r'href="([^"]+)"', main_nav.group(0))
            expect(nav_hrefs == NAV_ROUTES, f"{route}: main navigation order is {nav_hrefs}, expected {NAV_ROUTES}")
            nav_labels = [html.unescape(re.sub(r"<[^>]+>", "", label)).strip() for label in re.findall(r"<a[^>]*>(.*?)</a>", main_nav.group(0), re.S)]
            expect(nav_labels == NAV_LABELS, f"{route}: main navigation labels are {nav_labels}, expected {NAV_LABELS}")
            expect(re.search(r'class="nav-contact"[^>]*>\s*<a[^>]*href="/contact/"', main_nav.group(0)) is not None, f"{route}: Contact is not the button at the end of the main navigation")
            for target in NOT_IN_NAV:
                expect(f'href="{target}"' not in main_nav.group(0), f"{route}: {target} belongs in the footer, not the main navigation")
        if main_nav and route in NAV_ROUTES:
            expect(re.search(rf'<a[^>]*href="{re.escape(route)}"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="{re.escape(route)}"', main_nav.group(0)) is not None,
                   f"{route}: main navigation does not mark the current page with aria-current")
        if main_nav and route in idea_routes:
            expect('aria-current="true"' in main_nav.group(0), f"{route}: 'Ideas' is not marked as the current section")

    # Home page: "Getting started" path and the GSoC explainer
    if "/" in raw:
        source, text = raw["/"], parsed["/"].text
        start = re.search(r'id="getting-started".*?</section>', source, re.S)
        expect(bool(start), "/: 'Getting started' section missing")
        if start:
            for target in ("/ideas/", "/contributor-guide/", "/proposal/"):
                expect(f'href="{target}"' in start.group(0), f"/: 'Getting started' does not link to {target}")
        expect("What is Google Summer of Code?" in text and f'href="{GSOC_URL}"' in source, "/: 'What is Google Summer of Code?' section or official link missing")

    # Home page: the GSoC logo, unmodified, labelled and separate from the Elixpo mark
    if "/" in raw:
        source = raw["/"]
        hero = re.search(r'<header class="home-hero[^"]*".*?</header>', source, re.S)
        expect(bool(hero), "/: home hero missing")
        if hero:
            logo = re.search(r'<img[^>]*src="' + re.escape(GSOC_LOGO_SRC) + r'"[^>]*>', hero.group(0))
            expect(bool(logo) and f'alt="{GSOC_LOGO_ALT}"' in (logo.group(0) if logo else ""), "/: GSoC logo with the right alt text missing from the hero")
            figure = re.search(r'<figure class="gsoc-mark">.*?</figure>', hero.group(0), re.S)
            expect(bool(figure and GSOC_LOGO_LABEL in figure.group(0)), f"/: GSoC logo is not labelled {GSOC_LOGO_LABEL!r}")
            expect(bool(figure) and "icon-192.png" not in figure.group(0) and "elixpo-logo" not in figure.group(0), "/: the GSoC logo must not share a lockup with the Elixpo mark")
        expect("Track record" in parsed["/"].text and 'href="/about/"' in source, "/: 'Track record' section or link to /about/ missing")
        if hero:
            plain = lambda fragment: html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment))).strip()
            # The hero states the plan in a plain sentence, not in a callout box
            lead = re.search(r'<p class="lead">(.*?)</p>', hero.group(0), re.S)
            expect(bool(lead) and HOME_CAPACITY in plain(lead.group(1) if lead else ""), f"/: hero lead must say {HOME_CAPACITY!r}")
            expect('class="capacity"' not in source, "/: the intake callout box is back; state the plan in the hero lead")
            # One panel: logo, stats row of numerals, note
            panel = re.search(r'<aside class="hero-panel".*?</aside>', hero.group(0), re.S)
            expect(bool(panel and '<figure class="gsoc-mark">' in panel.group(0)), "/: the GSoC logo is not in the hero panel")
            stats = re.search(r'<dl class="hero-stats">(.*?)</dl>', panel.group(0) if panel else "", re.S)
            cells = re.findall(r"<div><dt>(.*?)</dt><dd>(.*?)</dd></div>", stats.group(1) if stats else "", re.S)
            found = [(plain(dd), plain(dt)) for dt, dd in cells]
            expect(found == HOME_STATS, f"/: hero stats row is {found}, expected {HOME_STATS}")
            expect(bool(panel and 'class="hero-panel-note"' in panel.group(0) and "Google selects participating organisations" in panel.group(0)),
                   "/: the note about Google selecting organisations is missing from the hero panel")
            strip = re.search(r'<ul class="credentials"[^>]*>(.*?)</ul>', hero.group(0), re.S)
            items = [tuple(plain(part) for part in re.findall(r"<(?:a|span)[^>]*>(.*?)</(?:a|span)>", item, re.S))
                     for item in re.findall(r"<li>(.*?)</li>", strip.group(1) if strip else "", re.S)]
            expect(items == HOME_CREDENTIALS, f"/: credential strip is {items}, expected {HOME_CREDENTIALS}")
        start = re.search(r'id="getting-started".*?</section>', source, re.S)
        numbers = re.findall(r'<span class="cell-number"[^>]*>(\d+)</span>', start.group(0) if start else "")
        expect(bool(start and 'class="hairline-grid step-grid"' in start.group(0)) and numbers == ["01", "02", "03", "04"],
               f"/: 'Getting started' must be a numbered 01-04 step grid, found {numbers}")
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
        expect("Community and mentoring record" in text and "Mentoring experience" in text, "/about/: 'Community and mentoring record' or 'Mentoring experience' section missing")
        expect("What this record does not show" not in text, "/about/: the removed self-critique section is back")

    # Projects page: all five codebases, each with repository, README, CONTRIBUTING, LICENSE and its ideas
    if "/projects/" in raw:
        source = raw["/projects/"]
        for repo in PROJECT_REPOS:
            base = f"https://github.com/elixpo/{repo}"
            for target in (base, f"{base}/blob/main/README.md", f"{base}/blob/main/CONTRIBUTING.md", f"{base}/blob/main/LICENSE"):
                expect(f'href="{target}"' in source, f"/projects/: link missing: {target}")
        for idea in ideas:
            expect(f'href="/ideas/{idea["slug"]}/"' in source, f"/projects/: idea {idea['slug']} not listed under its project")
        for project in projects:
            for label, key in (("Product site", "homepage"), ("Project page on elixpo.com", "elixpo_page")):
                expect(f'<dt>{label}</dt><dd><a href="{project[key]}">' in source, f"/projects/: {project['name']}: '{label}' link missing")
        main = re.search(r"<main.*?</main>", source, re.S)
        expect(bool(main) and not re.search(r"\bMIT\b", main.group(0) if main else ""), "/projects/: must not claim a licence; link the repository's LICENSE")

    # Mentors page: each role is a chip in a list
    if "/mentors/" in raw:
        source = raw["/mentors/"]
        roles_source = Path("src/data/people.ts").read_text(encoding="utf-8")
        for roles in re.findall(r"roles: \[([^\]]*)\]", roles_source):
            for role in re.findall(r'"([^"]+)"', roles):
                expect(re.search(r'<ul class="chips[^"]*"[^>]*>(?:(?!</ul>).)*<li class="chip">' + re.escape(html.escape(role, quote=False)) + "</li>", source, re.S) is not None,
                       f"/mentors/: role {role!r} is not shown as a chip")
        for role in ("Primary mentor", "Backup mentor"):
            expect(f'<li class="chip">{role}</li>' in source, f"/mentors/: {role!r} chip missing")

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
        headings = [html.unescape(re.sub(r"<[^>]+>", "", h)).strip() for h in re.findall(r'<h2 id="[^"]+">(.*?)</h2>', source, re.S)]
        found = [h for h in headings if h in IDEA_SECTIONS]
        expect(found == IDEA_SECTIONS, f"{route}: idea sections are {found}, expected {IDEA_SECTIONS}")
        warm = re.search(r'<h2 id="warm-up-tasks">Warm-up tasks</h2>.*?</section>', source, re.S)
        expect(bool(warm and re.search(r"<ol>\s*<li>", warm.group(0))), f"{route}: 'Warm-up tasks' section missing or empty")
        material = re.search(r'<h2 id="material">Material</h2>.*?</section>', source, re.S)
        expect(bool(material and f'href="{idea["repository"]}"' in material.group(0) and f'href="{idea["setup"]}"' in material.group(0)),
               f"{route}: 'Material' section missing the repository or setup link")
        project = project_of.get(str(idea["repository"]))
        expect(bool(project), f"{route}: no project in content/projects/ for {idea['repository']}")
        if project:
            for label, key in (("Product site", "homepage"), ("Project page on elixpo.com", "elixpo_page")):
                expect(f'<dt>{label}</dt><dd><a href="{project[key]}">' in source, f"{route}: '{label}' link missing")
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
    for route in ("/ideas/", "/faq/"):
        if route in parsed:
            expect(CAPACITY in parsed[route].text, f"{route}: capacity statement missing")
    listing, home, faq, people_page = (parsed.get(r) for r in ("/ideas/", "/", "/faq/", "/mentors/"))
    for idea in ideas:
        primary, backup = team[str(idea["primary_mentor"])]["name"], team[str(idea["backup_mentor"])]["name"]
        facts = [str(idea["title"]), f"{idea['size_hours']} hours", str(idea["difficulty"]), str(primary), str(backup)]
        for where, page in (("/ideas/", listing), ("/", home), (f"/ideas/{idea['slug']}/", parsed.get(f"/ideas/{idea['slug']}/"))):
            if page:
                for fact in facts:
                    expect(fact in page.text, f"{where}: missing {fact!r} for idea {idea['slug']}")
        if people_page:
            expect(str(idea["title"]) in people_page.text, f"/mentors/: idea {idea['slug']} not listed under its mentors")
    if faq:
        for info in mentors.values():
            expect(str(info["name"]) in faq.text, f"/faq/: mentor {info['name']} missing from the FAQ")
        counts = {size: sum(1 for idea in ideas if int(str(idea["size_hours"])) == size) for size in SIZES}
        sentence = f"{NUMBER_WORDS[counts[175]].capitalize()} ideas are 175 hours and {NUMBER_WORDS[counts[90]]} are 90 hours"
        expect(sentence in faq.text, f"/faq/: size counts out of date; expected {sentence!r}")
    if people_page:
        for info in team.values():
            expect(str(info["name"]) in people_page.text, f"/mentors/: {info['name']} missing")
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

    # Legal pages: effective dates
    for route in ("/privacy/", "/terms/"):
        if route in parsed:
            expect(PRIVACY_EFFECTIVE in parsed[route].text, f"{route}: effective date missing; expected {PRIVACY_EFFECTIVE!r}")
    if "/code-of-conduct/" in raw:
        source = raw["/code-of-conduct/"]
        for target in ("https://github.com/elixpo/elixpo/blob/main/CODE_OF_CONDUCT.md", "https://summerofcode.withgoogle.com/rules", f"mailto:{CONTACT}"):
            expect(f'href="{target}"' in source, f"/code-of-conduct/: link missing: {target}")
        expect("Conflict of interest" in parsed["/code-of-conduct/"].text, "/code-of-conduct/: conflict-of-interest route missing")

    # Privacy: what the build really contains must match what /privacy/ says
    tracking = []
    for path in list(site.rglob("*.html")) + list(site.rglob("*.js")):
        content = path.read_text(encoding="utf-8", errors="ignore")
        tracking += [f"{path.relative_to(site)}: {pattern.pattern}" for pattern in TRACKING_PATTERNS if pattern.search(content)]
    if "/privacy/" in parsed:
        privacy_text, privacy_raw = parsed["/privacy/"].text, raw["/privacy/"]
        if tracking:
            for claim, pattern in PRIVACY_DENIALS.items():
                expect(not pattern.search(privacy_text), f"/privacy/: claims no {claim}, but the build contains tracking or cookie code: {tracking[:3]}")
        for target in ("https://www.cloudflare.com/privacypolicy/", "https://policies.google.com/privacy", "https://summerofcode.withgoogle.com/rules",
                       "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement", f"mailto:{CONTACT}"):
            expect(f'href="{target}"' in privacy_raw, f"/privacy/: link missing: {target}")
        # Every third-party host the browser loads resources from must be named on /privacy/
        hosts = set()
        for page in parsed.values():
            hosts |= {re.sub(r"^https?://([^/]+).*$", r"\1", src) for src in page.srcs if re.match(r"^https?://", src)}
        for source in raw.values():
            hosts |= set(re.findall(r'<link[^>]*rel="(?:stylesheet|preload|preconnect|dns-prefetch)"[^>]*href="https?://([^/"]+)', source))
        hosts.discard(SITE_URL.removeprefix("https://"))
        for host in sorted(hosts):
            expect(host in {"github.com", "avatars.githubusercontent.com"} and "profile pictures" in privacy_text and "GitHub" in privacy_text,
                   f"/privacy/: pages load resources from {host}, which the privacy notice does not describe")

    # Agreements: the page, src/data/agreements.ts and public/agreements/ agree
    agreements_source = Path("src/data/agreements.ts").read_text(encoding="utf-8")
    entries = re.findall(r'github: "([^"]+)",.*?document: "([^"]+)",\s*status: "([^"]+)",\s*signedOn: (null|"[^"]*")', agreements_source, re.S)
    expect(sorted(handle for handle, *_ in entries) == sorted(team), f"src/data/agreements.ts covers {sorted(h for h, *_ in entries)}, expected everyone in people.ts")
    public_pdfs = {path.name for path in Path("public/agreements").glob("*.pdf")}
    template = "elixpo-gsoc-2027-commitment-template.pdf"
    if "/agreements/" in raw:
        source, text = raw["/agreements/"], parsed["/agreements/"].text
        expect("Published copies are signed electronically (typed name, GitHub account and date). Personal contact details are not included." in text,
               "/agreements/: note about electronic signatures missing")
        expect((f'href="/agreements/{template}"' in source) == (template in public_pdfs), "/agreements/: template link does not match public/agreements/")
        for handle, document, status, signed_on in entries:
            card = re.search(rf'<li data-github="{re.escape(handle)}" data-status="([^"]+)">(.*?)</li>\s*(?=<li data-github|</ol>)', source, re.S)
            expect(bool(card), f"/agreements/: no entry for {handle}")
            if not card:
                continue
            card_text = html.unescape(re.sub(r"<[^>]+>", " ", card.group(2)))
            expect(card.group(1) == status and str(team[handle]["name"]) in card_text, f"/agreements/: entry for {handle} does not match src/data/agreements.ts")
            name = document.rsplit("/", 1)[-1]
            if status == "signed":
                expect(name in public_pdfs and (site / document.lstrip("/")).is_file(), f"/agreements/: {handle} is signed but {document} is missing")
                expect(f'href="{document}"' in card.group(2) and "View signed copy (PDF)" in card_text and signed_on != "null",
                       f"/agreements/: signed copy link or date missing for {handle}")
            else:
                expect(status == "awaiting-signature" and "Awaiting signature" in card_text and "href=" not in card.group(2) and signed_on == "null",
                       f"/agreements/: {handle} must show 'Awaiting signature' and no link")
                expect(name not in public_pdfs, f"public/agreements/{name} exists but {handle} is not marked signed")
    known = {document.rsplit("/", 1)[-1] for _, document, _, _ in entries} | {template}
    for name in sorted(public_pdfs - known):
        errors.append(f"public/agreements/{name} does not belong to anyone in src/data/agreements.ts")

    # Old and short URLs for the mentors page redirect to /mentors/ (Cloudflare Pages _redirects)
    redirects_file = site / "_redirects"
    redirects = redirects_file.read_text(encoding="utf-8").split("\n") if redirects_file.is_file() else []
    for alias in ("/mentor", "/mentor/", "/people", "/people/"):
        expect(f"{alias} /mentors/ 301" in redirects, f"_redirects: {alias} must redirect to /mentors/ with 301")
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
