/**
 * Site-wide facts. Change them here only, so every page stays consistent.
 */
export const SITE_URL = "https://gsoc.elixpo.com";
export const SITE_NAME = "Elixpo GSoC";

/** Launch gate. Read at build time; anything other than "true" keeps the site out of search engines. */
export const SITE_LAUNCHED = process.env.NEXT_PUBLIC_SITE_LAUNCHED === "true";

export const CONTACT_EMAIL = "gsoc@elixpo.com"; // TODO confirm the mailbox is live and monitored before launch.
export const GITHUB_ORG_URL = "https://github.com/elixpo";
export const DISCUSSIONS_URL = "https://github.com/orgs/elixpo/discussions";
/**
 * GitHub Discussions for the programme open only once Google announces the
 * GSoC 2027 dates. Until then the programme email is the primary channel.
 */
export const DISCUSSIONS_OPEN = false;
export const DISCUSSIONS_NOTE =
  "GitHub Discussions for GSoC 2027 will open once Google announces the programme dates. Until then, write to gsoc@elixpo.com.";
/** The same fact, for places that already give the email address. */
export const DISCUSSIONS_NOTE_SHORT = "GitHub Discussions for GSoC 2027 will open once Google announces the programme dates.";
export const CODE_OF_CONDUCT_URL = "https://github.com/elixpo/elixpo/blob/main/CODE_OF_CONDUCT.md";
export const GSOC_TIMELINE_URL = "https://developers.google.com/open-source/gsoc/timeline";
export const GSOC_URL = "https://summerofcode.withgoogle.com/";
export const ELIXPO_URL = "https://elixpo.com";
export const ELIXPO_LOGO_URL = "https://elixpo.com/logos/logo.webp";
/** Date the Elixpo GitHub organisation was created (content/pages/about.md). */
export const ELIXPO_FOUNDING_DATE = "2024-02-24";
// TODO: link the source repository (github.com/elixpo/gsoc) from the footer once it is public.

export const STATUS_BANNER =
  "Elixpo is applying to be a mentoring organisation for Google Summer of Code 2027. Google announces accepted organisations after the application period.";
/** Intended intake, stated at the top of the ideas list as Google's mentor guide asks. */
export const CAPACITY_STATEMENT = "In 2027 we plan to mentor one contributor.";
/** The same plan, stated in the home hero. */
export const HOME_CAPACITY_SENTENCE = "In 2027 we plan to mentor one contributor, with a primary and a backup mentor on every project.";
/** Mentors on every idea: one primary, one backup. */
export const MENTORS_PER_IDEA = 2;
/** Contributors Elixpo plans to mentor in 2027. */
export const PLANNED_CONTRIBUTORS = 1;

/**
 * The credential strip under the home hero. Verified facts only, worded as in
 * elixpo/content/history.json (which wins on any conflict); each links to its
 * public record where one exists.
 */
export const HOME_CREDENTIALS = [
  {
    label: "Hacktoberfest 2024 & 2025",
    detail: "maintainer-led participation",
    href: "/about/#community-and-mentoring-record",
  },
  {
    label: "47 pull requests merged",
    detail: "Hacktoberfest 2025, from 24 GitHub accounts",
    href: "https://github.com/elixpo/elixpo_chapter/pulls?q=is%3Apr+is%3Amerged+label%3Ahacktoberfest+merged%3A2025-10-01..2025-10-31",
  },
  { label: "Organisation since 2024", detail: "github.com/elixpo", href: "https://github.com/elixpo" },
  { label: "Two mentors per idea", detail: "primary and backup", href: "/mentors/" },
] as const;
/** Required wherever the GSoC name or logo appears: shown in the footer of every page. */
export const GSOC_TRADEMARK_NOTICE =
  "Google Summer of Code and the GSoC logo are trademarks of Google LLC. Elixpo is applying as a mentoring organisation and is not affiliated with or endorsed by Google.";
/** Google's unmodified horizontal logo, downloaded from developers.google.com/open-source/gsoc/resources/downloads. */
export const GSOC_LOGO = { src: "/brand/gsoc/GSoC-Horizontal.png", width: 920, height: 147, alt: "Google Summer of Code logo" } as const;
export const RESPONSE_EXPECTATION = "Mentors aim to reply within 48 hours on weekdays.";
/** Label shown above the unmodified GSoC logo. */
export const GSOC_LOGO_LABEL = "Elixpo is applying to";

/** Date the content was last reviewed; used for the sitemap. */
export const CONTENT_REVIEWED = "2026-10-29";

/**
 * Primary navigation, in this order, with Contact as a button at the end.
 * Agenda, Selection, AI policy, Glossary, About, Why Elixpo and How we run the programme live in the footer site map
 * and in contextual links (the proposal page links Selection and AI policy).
 */
export const NAV = [
  { href: "/ideas/", label: "Ideas" },
  { href: "/projects/", label: "Projects" },
  { href: "/proposal/", label: "Proposal" },
  { href: "/timeline/", label: "Timeline" },
  { href: "/mentors/", label: "Mentors" },
  { href: "/faq/", label: "FAQ" },
  { href: "/contributor-guide/", label: "Get involved" },
] as const;
export const NAV_CONTACT = { href: "/contact/", label: "Contact" } as const;

/**
 * Every page, with a plain one-line description. Used for the footer site map
 * and the "What next?" block at the end of each page. Pages list their next
 * steps in their frontmatter (`next:`), by route.
 */
export const SITE_MAP = [
  { href: "/", label: "Home", about: "Elixpo's plans for Google Summer of Code 2027." },
  { href: "/ideas/", label: "Project ideas", about: "The six project ideas, with size, difficulty and mentors." },
  { href: "/projects/", label: "Participating projects", about: "The five codebases the ideas belong to." },
  { href: "/contributor-guide/", label: "Get involved", about: "How to prepare and apply, step by step." },
  { href: "/proposal/", label: "Proposal template", about: "The sections every proposal must contain." },
  { href: "/selection/", label: "Selection criteria", about: "How mentors evaluate applications." },
  { href: "/ai-policy/", label: "AI policy", about: "Permitted use of AI tools, and what you must disclose." },
  { href: "/timeline/", label: "Timeline", about: "The stages of the programme and where official dates are published." },
  { href: "/mentors/", label: "Mentors", about: "Mentors, the organisation administrators and the programme coordinator." },
  { href: "/operations/", label: "How we run the programme", about: "Weekly cadence, mentor cover, evaluations, escalation and what happens after the programme." },
  { href: "/faq/", label: "FAQ", about: "Answers to common questions." },
  { href: "/glossary/", label: "Glossary", about: "Definitions of the terms used on this site." },
  { href: "/contact/", label: "Contact", about: "Public channels and the programme email address." },
  { href: "/agenda/", label: "Our agenda", about: "Why Elixpo takes part, what it ships, how it decides and what it commits to contributors." },
  { href: "/why-elixpo/", label: "Why Elixpo for GSoC", about: "Short, evidence-linked answers for programme reviewers." },
  { href: "/about/", label: "About Elixpo", about: "Elixpo's community and mentoring record, with sources." },
] as const;

/**
 * Legal and community pages, in this order, in the footer of every page.
 * They are reachable from the footer only, not from the main navigation.
 */
export const LEGAL_PAGES = [
  { href: "/privacy/", label: "Privacy", about: "What this site and the programme do with personal information." },
  { href: "/terms/", label: "Terms of service", about: "Licences, trademarks and the terms for using this site." },
  { href: "/code-of-conduct/", label: "Code of Conduct", about: "How everyone in the programme is expected to behave, and how to report a concern." },
  { href: "/contributing/", label: "Contributing", about: "How to suggest ideas, fix this site and contribute to the projects." },
  { href: "/agreements/", label: "Agreements", about: "The commitments signed by every mentor and administrator." },
] as const;

export type SiteMapEntry = (typeof SITE_MAP)[number] | (typeof LEGAL_PAGES)[number];

export function siteMapEntry(href: string): SiteMapEntry {
  const entry = [...SITE_MAP, ...LEGAL_PAGES].find((item) => item.href === href);
  if (!entry) throw new Error(`Unknown page "${href}". Add it to SITE_MAP in src/data/site.ts.`);
  return entry;
}
