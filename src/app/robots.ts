import type { MetadataRoute } from "next";
import { SITE_LAUNCHED } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Launch gate: block all crawlers until NEXT_PUBLIC_SITE_LAUNCHED=true at build time. */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_LAUNCHED) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
