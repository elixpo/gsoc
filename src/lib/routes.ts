import { ALL_PAGES } from "@/data/site";
import { IDEAS } from "./content";

/**
 * Every public route, with the trailing slash the static export uses: every
 * page in SITE_MAP and LEGAL_PAGES (src/data/site.ts), then every idea page.
 * Deriving the list keeps the sitemap complete when a page is added.
 */
export const STATIC_ROUTES = ALL_PAGES.map((page) => page.href);
export const ALL_ROUTES = [...STATIC_ROUTES, ...IDEAS.map((idea) => `/ideas/${idea.slug}/`)];
