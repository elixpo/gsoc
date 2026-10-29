import type { Metadata } from "next";
import { PageHeroCard } from "@/components/HeroCards";
import { JsonLd, nextLinks, PageHero, PageLayout, Prose, Tldr, WhatNext } from "@/components/blocks";
import { getAbout } from "@/lib/content";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID, pageMetadata, WEBSITE_ID } from "@/lib/seo";

const { page, sections } = getAbout();

export const metadata: Metadata = pageMetadata({ title: page.title, description: page.description, path: "/about/", social: "about" });

export default function AboutPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: page.title,
    description: page.description,
    url: absoluteUrl("/about/"),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };
  return (
    <>
      <JsonLd data={[structured, breadcrumbJsonLd([{ name: page.title, path: "/about/" }])]} />
      <PageHero eyebrow="About Elixpo" headingHtml={page.headingHtml} lead={page.lead} aside={<PageHeroCard slug="about" />} />
      <Tldr items={page.tldrHtml} />
      <PageLayout toc={sections.map(({ id, heading }) => ({ id, text: heading }))}>
        {sections.map((section) => (
          <section className="page-section" key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id}>{section.heading}</h2>
            <Prose html={section.html} />
            {section.history.length > 0 && (
              <ol className="history">
                {section.history.map((entry) => (
                  <li key={entry.title}>
                    <p className="history-date">{entry.date}</p>
                    <div>
                      <h3>{entry.title}</h3>
                      <Prose html={entry.html} />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </PageLayout>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
