import type { Metadata } from "next";
import { JsonLd, nextLinks, PageHero, PageLayout, Prose, Tldr, WhatNext } from "@/components/blocks";
import { PageHeroCard } from "@/components/HeroCards";
import { getPage, tableOfContents } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export function markdownMetadata(slug: string): Metadata {
  const page = getPage(slug);
  return pageMetadata({ title: page.title, description: page.description, path: `/${slug}/`, social: slug });
}

/**
 * A page rendered from content/pages/<slug>.md. `extraToc` adds entries for
 * sections passed as children, so the "On this page" list covers them too.
 * The TL;DR is left out on pages without one (TLDR_EXEMPT in src/lib/content.ts).
 */
export function MarkdownPage({
  slug,
  eyebrow,
  children,
  extraToc = [],
  aside,
}: {
  slug: string;
  eyebrow: string;
  children?: React.ReactNode;
  extraToc?: { id: string; text: string }[];
  /** The hero card on the right; defaults to the page's card in src/components/HeroCards.tsx. */
  aside?: React.ReactNode;
}) {
  const page = getPage(slug);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: `/${slug}/` }])} />
      <PageHero eyebrow={eyebrow} headingHtml={page.headingHtml} lead={page.lead} aside={aside ?? <PageHeroCard slug={slug} />} />
      <Tldr items={page.tldrHtml} />
      <PageLayout toc={[...tableOfContents(page.html), ...extraToc]}>
        <Prose html={page.html} />
        {children}
      </PageLayout>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
