import type { MetadataRoute } from "next";
import { CONTENT_REVIEWED } from "@/data/site";
import { ALL_ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: CONTENT_REVIEWED,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : route.startsWith("/ideas/") ? 0.9 : 0.7,
  }));
}
