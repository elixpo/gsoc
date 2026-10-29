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
export const CAPACITY_STATEMENT = "In 2027 we expect to mentor one contributor.";
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
 * People, Selection, AI policy, Glossary and About live in the footer site map
 * and in contextual links (the proposal page links Selection and AI policy).
 */
export const NAV = [
  { href: "/ideas/", label: "Ideas" },
  { href: "/projects/", label: "Projects" },
  { href: "/proposal/", label: "Proposal" },
  { href: "/timeline/", label: "Timeline" },
  { href: "/people/", label: "People" },
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
  { href: "/people/", label: "People", about: "Mentors, the organisation administrators and the programme coordinator." },
  { href: "/faq/", label: "FAQ", about: "Answers to common questions." },
  { href: "/glossary/", label: "Glossary", about: "Definitions of the terms used on this site." },
  { href: "/contact/", label: "Contact", about: "Public channels and the programme email address." },
  { href: "/about/", label: "About Elixpo", about: "Elixpo's community and mentoring record, with sources." },
] as const;

export type SiteMapEntry = (typeof SITE_MAP)[number];

export function siteMapEntry(href: string): SiteMapEntry {
  const entry = SITE_MAP.find((item) => item.href === href);
  if (!entry) throw new Error(`Unknown page "${href}". Add it to SITE_MAP in src/data/site.ts.`);
  return entry;
}
