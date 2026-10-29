import { nextLinks, PageHero, WhatNext } from "@/components/blocks";
import { markdownMetadata } from "@/components/MarkdownPage";
import { getFaq } from "@/lib/content";
import { jsonLd, stripTags } from "@/lib/seo";

export const metadata = markdownMetadata("faq");

export default function FaqPage() {
  const { page, items } = getFaq();
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <PageHero eyebrow="FAQ" heading={page.heading} lead={page.lead} />
      <section className="content faq">
        {items.map((item, index) => (
          <section key={item.question} aria-labelledby={`faq-${index + 1}`}>
            <h2 id={`faq-${index + 1}`}>{item.question}</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
          </section>
        ))}
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
