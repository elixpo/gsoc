import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { CONTACT_EMAIL, ELIXPO_FOUNDING_DATE, ELIXPO_LOGO_URL, ELIXPO_URL, GITHUB_ORG_URL, SITE_NAME, SITE_URL } from "@/data/site";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
export const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** Size of the generated per-page cards (src/app/social/[slug]/route.tsx). */
export const GENERATED_CARD_SIZE = { width: 1200, height: 630 } as const;

/** Width and height of a PNG, read from its IHDR chunk. */
function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(0, 24);
  if (header.toString("latin1", 1, 4) !== "PNG" || header.toString("latin1", 12, 16) !== "IHDR") {
    throw new Error(`${file} is not a PNG file`);
  }
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

/**
 * A hand-designed card at public/og-image.png, when present, replaces the
 * generated home card (and with it the site-wide default). The Elixpo branding
 * pipeline outputs 1280x720, so the real size is read from the file at build
 * time rather than assumed.
 */
const CUSTOM_HOME_CARD = "/og-image.png";
const customHomeCardFile = join(process.cwd(), "public", "og-image.png");
const customHomeCardSize = existsSync(customHomeCardFile) ? pngSize(customHomeCardFile) : null;

/** The social card for a route: its path and its real size. */
export function socialCard(slug: string): { url: string; width: number; height: number } {
  if (slug === "home" && customHomeCardSize) return { url: CUSTOM_HOME_CARD, ...customHomeCardSize };
  return { url: `/social/${slug}.png`, ...GENERATED_CARD_SIZE };
}

/** Path of the social card for a route. */
export const socialImage = (slug: string) => socialCard(slug).url;

export function pageMetadata(options: { title: string; description: string; path: string; social: string; absoluteTitle?: boolean }): Metadata {
  const { title, description, path, social } = options;
  const card = socialCard(social);
  const fullTitle = options.absoluteTitle ? title : `${title} · ${SITE_NAME}`.length > 60 ? title : `${title} · ${SITE_NAME}`;
  const alt = `${title}: Elixpo, Google Summer of Code 2027`;
  return {
    title: options.absoluteTitle || `${title} · ${SITE_NAME}`.length > 60 ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      title: fullTitle,
      description,
      url: path,
      images: [{ url: card.url, width: card.width, height: card.height, alt, type: "image/png" }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: card.url, alt }] },
  };
}

export const ORGANIZATION_ID = `${ELIXPO_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Elixpo",
  url: ELIXPO_URL,
  logo: ELIXPO_LOGO_URL,
  foundingDate: ELIXPO_FOUNDING_DATE,
  sameAs: [GITHUB_ORG_URL],
  contactPoint: [{ "@type": "ContactPoint", contactType: "Google Summer of Code programme", email: CONTACT_EMAIL, availableLanguage: ["en"] }],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  alternateName: "Elixpo · Google Summer of Code 2027",
  url: `${SITE_URL}/`,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
};

/** BreadcrumbList for an inner page. `trail` excludes Home, which is always first. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

