import type { Metadata } from "next";
import Link from "next/link";
import { Capacity, IdeaCards, nextLinks, Prose, WhatNext } from "@/components/blocks";
import { getPage, IDEAS, sections, renderMarkdown } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const page = getPage("home");

/** Stable anchor for a home section heading, e.g. "What is Google Summer of Code?" -> "what-is-google-summer-of-code". */
const anchor = (heading: string) => heading.toLowerCase().replace(/\W+/g, "-").replace(/^-|-$/g, "");

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
            <Link href="#start-here">Where to start</Link>
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
          <section className={`split split-${anchor(section.heading)}`} key={section.heading} aria-labelledby={anchor(section.heading)}>
            <h2 id={anchor(section.heading)}>{section.heading}</h2>
            <Prose html={renderMarkdown(section.markdown)} />
          </section>
        ))}
      </div>

      <section className="band" aria-labelledby="home-ideas">
        <div className="band-head">
          <p className="eyebrow">Project ideas</p>
          <h2 id="home-ideas">The six project ideas</h2>
          <p>
            Each idea is a project you could work on over the summer. Read the short summaries, then open the one that interests you. You can also{" "}
            <Link href="/ideas/">compare all ideas in one table</Link>.
          </p>
        </div>
        <IdeaCards ideas={IDEAS} />
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
