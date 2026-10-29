import type { Metadata } from "next";
import { JsonLd, nextLinks, PageHero, PageLayout, Prose, WhatNext } from "@/components/blocks";
import { getPage, tableOfContents } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export function markdownMetadata(slug: string): Metadata {
  const page = getPage(slug);
  return pageMetadata({ title: page.title, description: page.description, path: `/${slug}/`, social: slug });
}

/**
 * A page rendered from content/pages/<slug>.md. `extraToc` adds entries for
 * sections passed as children, so the "On this page" list covers them too.
 */
export function MarkdownPage({
  slug,
  eyebrow,
  children,
  extraToc = [],
}: {
  slug: string;
  eyebrow: string;
  children?: React.ReactNode;
  extraToc?: { id: string; text: string }[];
}) {
  const page = getPage(slug);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: `/${slug}/` }])} />
      <PageHero eyebrow={eyebrow} heading={page.heading} lead={page.lead} />
      <PageLayout toc={[...tableOfContents(page.html), ...extraToc]}>
        <Prose html={page.html} />
        {children}
      </PageLayout>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
