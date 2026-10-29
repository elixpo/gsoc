import type { Metadata } from "next";
import Link from "next/link";
import { Capacity, IdeaCards, Prose } from "@/components/blocks";
import { getPage, IDEAS, sections, renderMarkdown } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const page = getPage("home");

export const metadata: Metadata = pageMetadata({
  title: "Elixpo · Google Summer of Code 2027",
  description: page.description,
  path: "/",
  social: "home",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <header className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Google Summer of Code 2027</p>
          <h1>{page.heading}</h1>
          <p className="lead">{page.lead}</p>
          <Capacity />
          <div className="actions">
            <Link href="/ideas/">See the {IDEAS.length} project ideas</Link>
            <Link href="/contributor-guide/">How to get involved</Link>
          </div>
        </div>
        <div className="hero-objects" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <div className="object object-code">
            <i />
            <i />
            <i />
            <b>OPEN SOURCE</b>
          </div>
          <div className="object object-model">
            <span>MENTORS</span>
            <b>PRIMARY + BACKUP</b>
          </div>
        </div>
      </header>

      <div className="home-sections">
        {sections(page.body).map((section) => (
          <section className="split" key={section.heading} aria-labelledby={`home-${section.heading.toLowerCase().replace(/\W+/g, "-")}`}>
            <h2 id={`home-${section.heading.toLowerCase().replace(/\W+/g, "-")}`}>{section.heading}</h2>
            <Prose html={renderMarkdown(section.markdown)} />
          </section>
        ))}
      </div>

      <section className="band" aria-labelledby="home-ideas">
        <div className="band-head">
          <p className="eyebrow">Project ideas</p>
          <h2 id="home-ideas">Six ideas, one contributor</h2>
          <p>
            Pick the idea that fits you best. <Link href="/ideas/">Compare all ideas in one table</Link>.
          </p>
        </div>
        <IdeaCards ideas={IDEAS} />
      </section>
    </>
  );
}
