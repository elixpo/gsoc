import { JsonLd, nextLinks, PageHero, Tldr, WhatNext } from "@/components/blocks";
import { markdownMetadata } from "@/components/MarkdownPage";
import { getFaq } from "@/lib/content";
import { breadcrumbJsonLd, stripTags } from "@/lib/seo";

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
      <JsonLd data={[structured, breadcrumbJsonLd([{ name: "FAQ", path: "/faq/" }])]} />
      <PageHero eyebrow="FAQ" headingHtml={page.headingHtml} lead={page.lead} />
      <Tldr items={page.tldrHtml} />
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
