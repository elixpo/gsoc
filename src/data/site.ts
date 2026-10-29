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
// TODO: link the source repository (github.com/elixpo/gsoc) from the footer once it is public.

export const STATUS_BANNER =
  "Elixpo is preparing to apply as a GSoC 2027 mentoring organisation. Google has not yet announced GSoC 2027.";
export const CAPACITY_STATEMENT = "Elixpo is a first-time applicant and plans to mentor one contributor in 2027.";
export const RESPONSE_EXPECTATION = "Mentors aim to reply within 48 hours on weekdays.";

/** Date the content was last reviewed; used for the sitemap. */
export const CONTENT_REVIEWED = "2026-10-29";

export const NAV = [
  { href: "/ideas/", label: "Ideas" },
  { href: "/contributor-guide/", label: "Get involved" },
  { href: "/proposal/", label: "Proposal" },
  { href: "/selection/", label: "Selection" },
  { href: "/people/", label: "People" },
  { href: "/faq/", label: "FAQ" },
  { href: "/contact/", label: "Contact" },
] as const;
