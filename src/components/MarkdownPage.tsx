import type { Metadata } from "next";
import { PageHero, Prose } from "@/components/blocks";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function markdownMetadata(slug: string): Metadata {
  const page = getPage(slug);
  return pageMetadata({ title: page.title, description: page.description, path: `/${slug}/`, social: slug });
}

export function MarkdownPage({ slug, eyebrow, children }: { slug: string; eyebrow: string; children?: React.ReactNode }) {
  const page = getPage(slug);
  return (
    <>
      <PageHero eyebrow={eyebrow} heading={page.heading} lead={page.lead} />
      <section className="content">
        <Prose html={page.html} />
      </section>
      {children}
    </>
  );
}
