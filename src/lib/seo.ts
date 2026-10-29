import type { Metadata } from "next";
import { ELIXPO_LOGO_URL, ELIXPO_URL, GITHUB_ORG_URL, SITE_NAME, SITE_URL } from "@/data/site";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
export const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** Path of the build-time social card for a route. */
export const socialImage = (slug: string) => `/social/${slug}.png`;

export function pageMetadata(options: { title: string; description: string; path: string; social: string; absoluteTitle?: boolean }): Metadata {
  const { title, description, path, social } = options;
  const image = socialImage(social);
  const fullTitle = options.absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      title: fullTitle,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: `${title}: Elixpo, Google Summer of Code 2027` }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

export const ORGANIZATION_ID = `${ELIXPO_URL}/#organization`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Elixpo",
  url: ELIXPO_URL,
  logo: ELIXPO_LOGO_URL,
  sameAs: [GITHUB_ORG_URL],
};
