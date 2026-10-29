import { PageHeroCard } from "@/components/HeroCards";
import { JsonLd, nextLinks, PageHero, Tldr, WhatNext } from "@/components/blocks";
import { markdownMetadata } from "@/components/MarkdownPage";
import { getQuestions } from "@/lib/content";
import { breadcrumbJsonLd, stripTags } from "@/lib/seo";

export const metadata = markdownMetadata("why-elixpo");

/** Short, evidence-linked answers for Google Summer of Code programme reviewers. */
export default function WhyElixpoPage() {
  const { page, items } = getQuestions("why-elixpo");
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: stripTags(item.answerHtml) },
    })),
  };
  return (
    <>
      <JsonLd data={[structured, breadcrumbJsonLd([{ name: page.title, path: "/why-elixpo/" }])]} />
      <PageHero eyebrow="For programme reviewers" headingHtml={page.headingHtml} lead={page.lead} aside={<PageHeroCard slug="why-elixpo" />} />
      <Tldr items={page.tldrHtml} />
      <section className="content faq">
        {items.map((item, index) => (
          <section key={item.question} aria-labelledby={`q-${index + 1}`}>
            <h2 id={`q-${index + 1}`}>{item.question}</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
          </section>
        ))}
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
