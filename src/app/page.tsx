import type { Metadata } from "next";
import Link from "next/link";
import { Capacity, GsocMark, IdeaCards, nextLinks, Prose, WhatNext } from "@/components/blocks";
import { getPage, IDEAS, sections, renderMarkdown, slugify } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const page = getPage("home");

export const metadata: Metadata = pageMetadata({
  title: "Elixpo · Google Summer of Code 2027",
  description: page.description,
  path: "/",
  social: "home",
  absoluteTitle: true,
});

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const inWords = (count: number) => NUMBER_WORDS[count] ?? String(count);

export default function Home() {
  return (
    <>
      <header className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Google Summer of Code 2027 · mentoring organisation application</p>
          <h1>{page.heading}</h1>
          <p className="lead">{page.lead}</p>
          <Capacity />
          <div className="actions">
            <Link href="/ideas/">See the {IDEAS.length} project ideas</Link>
            <Link href="/contributor-guide/">How to apply</Link>
          </div>
        </div>
        <aside className="home-hero-side" aria-label="Key facts">
          <GsocMark note={<>Google selects participating organisations and announces them after the application period.</>} />
          <dl className="key-facts">
            <div>
              <dt>Contributors we expect to mentor</dt>
              <dd>One</dd>
            </div>
            <div>
              <dt>Project ideas</dt>
              <dd>{inWords(IDEAS.length).replace(/^./, (letter) => letter.toUpperCase())}</dd>
            </div>
            <div>
              <dt>Mentors per idea</dt>
              <dd>Two</dd>
            </div>
          </dl>
        </aside>
      </header>

      <div className="home-sections">
        {sections(page.body).map((section) => (
          <section className={`split split-${slugify(section.heading)}`} key={section.heading} aria-labelledby={slugify(section.heading)}>
            <h2 id={slugify(section.heading)}>{section.heading}</h2>
            <Prose html={renderMarkdown(section.markdown)} />
          </section>
        ))}
      </div>

      <section className="band" aria-labelledby="home-ideas">
        <div className="band-head">
          <p className="eyebrow">Project ideas</p>
          <h2 id="home-ideas">The {inWords(IDEAS.length)} project ideas</h2>
          <p>
            Each idea is a defined piece of work in one Elixpo codebase, with stated outcomes and two mentors. Open an idea for its full description, or{" "}
            <Link href="/ideas/">compare all ideas in one table</Link>.
          </p>
        </div>
        <IdeaCards ideas={IDEAS} />
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
