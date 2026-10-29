import type { Metadata } from "next";
import { Capacity, IdeaCards, IdeaTable, PageHero, Prose } from "@/components/blocks";
import { getPage, IDEAS } from "@/lib/content";
import { absoluteUrl, jsonLd, ORGANIZATION_ID, pageMetadata } from "@/lib/seo";

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <PageHero eyebrow="Project ideas" heading={page.heading} lead={page.lead}>
        <Capacity />
      </PageHero>
      <section className="content" aria-labelledby="ideas-overview">
        <h2 id="ideas-overview">All ideas at a glance</h2>
        <IdeaTable ideas={IDEAS} headingId="ideas-overview" />
      </section>
      <section className="content">
        <Prose html={page.html} />
      </section>
      <section className="content" aria-labelledby="ideas-summaries">
        <h2 id="ideas-summaries">What each idea is about</h2>
        <IdeaCards ideas={IDEAS} />
      </section>
    </>
  );
}
