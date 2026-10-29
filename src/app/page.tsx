import type { Metadata } from "next";
import Link from "next/link";
import { GsocMark, HeroGeometry, IdeaCards, nextLinks, Prose, StepGrid, Tldr, WhatNext } from "@/components/blocks";
import { HOME_CAPACITY_SENTENCE, HOME_CREDENTIALS, MENTORS_PER_IDEA, PLANNED_CONTRIBUTORS } from "@/data/site";
import { getPage, IDEAS, PROJECTS, renderMarkdown, sections, slugify, steps } from "@/lib/content";
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

/** The stats row in the hero panel: numerals, equal cells, one baseline. */
const STATS = [
  { value: PLANNED_CONTRIBUTORS, label: "contributor in 2027" },
  { value: IDEAS.length, label: "project ideas" },
  { value: MENTORS_PER_IDEA, label: "mentors on every idea" },
  { value: PROJECTS.length, label: "participating projects" },
];

/** Sections rendered as a numbered step grid instead of prose. */
const STEP_SECTIONS = new Set(["Getting started"]);

if (!page.lead.includes(HOME_CAPACITY_SENTENCE)) {
  throw new Error(`content/pages/home.md: the lead must include "${HOME_CAPACITY_SENTENCE}" (src/data/site.ts)`);
}

export default function Home() {
  return (
    <>
      <header className="home-hero hero-card">
        <HeroGeometry />
        <div className="home-hero-copy">
          <p className="eyebrow">Google Summer of Code 2027 · mentoring organisation application</p>
          <h1 dangerouslySetInnerHTML={{ __html: page.headingHtml }} />
          <p className="lead">{page.lead}</p>
          <div className="actions">
            <Link href="/ideas/">See the {IDEAS.length} project ideas</Link>
            <Link href="/contributor-guide/">How to apply</Link>
            <Link href="/why-elixpo/">Why Elixpo for GSoC</Link>
          </div>
          <ul className="credentials" aria-label="Track record">
            {HOME_CREDENTIALS.map((item) => (
              <li key={item.label}>
                {item.href.startsWith("/") ? <Link href={item.href}>{item.label}</Link> : <a href={item.href}>{item.label}</a>}
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="hero-panel" aria-label="Key facts">
          <GsocMark />
          <dl className="hero-stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="hero-panel-note">Google selects participating organisations and announces them after the application period.</p>
        </aside>
      </header>
      <Tldr items={page.tldrHtml} />

      <div className="home-sections">
        {sections(page.body).map((section) => (
          <section className={`split split-${slugify(section.heading)}`} key={section.heading} aria-labelledby={slugify(section.heading)}>
            <h2 id={slugify(section.heading)}>{section.heading}</h2>
            {STEP_SECTIONS.has(section.heading) ? (
              <StepGrid steps={steps(section.markdown)} label={section.heading} />
            ) : (
              <Prose html={renderMarkdown(section.markdown)} />
            )}
          </section>
        ))}
      </div>

      <section className="band" aria-labelledby="home-ideas">
        <div className="band-head">
          <p className="eyebrow">Project ideas</p>
          <h2 id="home-ideas">
            The {inWords(IDEAS.length)} <em>project ideas</em>
          </h2>
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
