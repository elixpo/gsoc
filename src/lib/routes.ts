import { IDEAS } from "./content";

/** Every public route, with the trailing slash the static export uses. */
export const STATIC_ROUTES = ["/", "/ideas/", "/projects/", "/mentors/", "/contributor-guide/", "/proposal/", "/selection/", "/ai-policy/", "/timeline/", "/faq/", "/glossary/", "/contact/", "/about/", "/privacy/", "/terms/", "/code-of-conduct/", "/contributing/", "/agreements/"];
export const ALL_ROUTES = [...STATIC_ROUTES, ...IDEAS.map((idea) => `/ideas/${idea.slug}/`)];
