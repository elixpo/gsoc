import type { Metadata } from "next";
import { PageHeroCard } from "@/components/HeroCards";
import { Capacity, IdeaCards, IdeaTable, JsonLd, nextLinks, PageHero, Prose, Tldr, WhatNext } from "@/components/blocks";
import { getPage, IDEAS } from "@/lib/content";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID, pageMetadata } from "@/lib/seo";

const page = getPage("ideas");

export const metadata: Metadata = pageMetadata({ title: page.title, description: page.description, path: "/ideas/", social: "ideas" });

export default function IdeasPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Elixpo Google Summer of Code 2027 project ideas",
    url: absoluteUrl("/ideas/"),
    numberOfItems: IDEAS.length,
    itemListElement: IDEAS.map((idea, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: idea.title,
      url: absoluteUrl(`/ideas/${idea.slug}/`),
    })),
    publisher: { "@id": ORGANIZATION_ID },
  };
  return (
    <>
      <JsonLd data={[structured, breadcrumbJsonLd([{ name: "Ideas", path: "/ideas/" }])]} />
      <PageHero eyebrow="Project ideas" headingHtml={page.headingHtml} lead={page.lead} aside={<PageHeroCard slug="ideas" />}>
        <Capacity />
      </PageHero>
      <Tldr items={page.tldrHtml} />
      <section className="content content-split">
        <Prose html={page.html} />
      </section>
      <section className="content" aria-labelledby="ideas-overview">
        <h2 id="ideas-overview">All ideas at a glance</h2>
        <IdeaTable ideas={IDEAS} headingId="ideas-overview" />
      </section>
      <section className="content" aria-labelledby="ideas-summaries">
        <h2 id="ideas-summaries">What each idea is about</h2>
        <IdeaCards ideas={IDEAS} />
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
