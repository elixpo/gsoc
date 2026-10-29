import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nextLinks, RoleChips, sizeLabel, WhatNext } from "@/components/blocks";
import { getIdea, IDEAS, neighbours, type IdeaSection } from "@/lib/content";
import { CONTACT_EMAIL, DISCUSSIONS_URL, RESPONSE_EXPECTATION } from "@/data/site";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return IDEAS.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const idea = getIdea((await params).slug);
  if (!idea) return {};
  return {
    ...pageMetadata({ title: idea.title, description: idea.summary, path: `/ideas/${idea.slug}/`, social: idea.slug }),
    keywords: ["Google Summer of Code", "GSoC 2027", "Elixpo", idea.theme, ...idea.skills],
  };
}

/** Plain one-line hints shown under each formal section heading. */
const HINTS: Partial<Record<IdeaSection, string>> = {
  Problem: "What is broken or missing today.",
  "Expected outcomes": "What should exist at the end of the project.",
  "Stretch goals": "Extra work to try only if the main goals are finished early.",
  "Not in scope": "Work that is not part of this project, even if it seems related.",
  "Proof of success": "How you and your mentors will know the work is done.",
};

function Section({ id, title, html }: { id: string; title: IdeaSection; html: string }) {
  return (
    <section className="idea-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {HINTS[title] && <p className="section-hint">{HINTS[title]}</p>}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}

export default async function IdeaPage({ params }: Props) {
  const idea = getIdea((await params).slug);
  if (!idea) notFound();

  const url = absoluteUrl(`/ideas/${idea.slug}/`);
  const { previous, next } = neighbours(idea.slug);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Ideas", item: absoluteUrl("/ideas/") },
      { "@type": "ListItem", position: 3, name: idea.title, item: url },
    ],
  };
  const mentors = [
    { person: idea.primaryMentor, role: "Primary mentor" },
    { person: idea.backupMentor, role: "Backup mentor" },
  ];

  return (
    <article className="idea-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <span className="crumb-sep" aria-hidden="true">
              /
            </span>
            <Link href="/ideas/">Ideas</Link>
          </li>
          <li aria-current="page">
            <span className="crumb-sep" aria-hidden="true">
              /
            </span>
            {idea.title}
          </li>
        </ol>
      </nav>

      <header className="idea-hero">
        <div>
          <p className="eyebrow">
            Idea {idea.order} of {IDEAS.length} · {idea.theme}
          </p>
          <h1>{idea.title}</h1>
          <p className="in-short">
            <strong>In short:</strong> {idea.inShort}
          </p>
          <p className="lead">{idea.summary}</p>
        </div>
        <aside className="idea-facts" aria-label="Key facts about this idea">
          <dl>
            <div>
              <dt>Size</dt>
              <dd>{sizeLabel(idea.sizeHours)}</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>{idea.difficulty}</dd>
            </div>
            <div>
              <dt>Primary mentor</dt>
              <dd>{idea.primaryMentor.name}</dd>
            </div>
            <div>
              <dt>Backup mentor</dt>
              <dd>{idea.backupMentor.name}</dd>
            </div>
            <div>
              <dt>Repository</dt>
              <dd>
                <a href={idea.repository}>{idea.repositoryName}</a>
              </dd>
            </div>
          </dl>
          <p className="note">
            <Link href="/glossary/">What do these words mean?</Link>
          </p>
        </aside>
      </header>

      <div className="idea-body">
        <div className="idea-main">
          <section className="idea-section" aria-labelledby="why">
            <h2 id="why">Why this matters</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: idea.sections["Why this matters"] }} />
            <p className="section-hint">
              New to some of the words below? See <a href="#words">words used on this page</a>.
            </p>
          </section>
          <Section id="problem" title="Problem" html={idea.sections["Problem"]} />
          <Section id="outcomes" title="Expected outcomes" html={idea.sections["Expected outcomes"]} />
          <Section id="stretch" title="Stretch goals" html={idea.sections["Stretch goals"]} />
          <Section id="not-in-scope" title="Not in scope" html={idea.sections["Not in scope"]} />
          <Section id="proof" title="Proof of success" html={idea.sections["Proof of success"]} />

          <section className="start-box" aria-labelledby="how-to-start">
            <h2 id="how-to-start">How to start on this idea</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: idea.sections["How to start"] }} />
            <div className="start-links">
              <div>
                <h3>Links you will need</h3>
                <ul className="link-list">
                  <li>
                    <a href={idea.repository}>Code repository: {idea.repositoryName}</a>
                  </li>
                  <li>
                    <a href={idea.setup}>Setup instructions (README)</a>
                  </li>
                  {idea.envExample && (
                    <li>
                      <a href={idea.envExample}>Example settings file (.env.example)</a>
                    </li>
                  )}
                  <li>
                    <a href={`${idea.repository}/blob/main/CONTRIBUTING.md`}>How to send changes (CONTRIBUTING)</a>
                  </li>
                </ul>
                <p className="note">You should not need any Elixpo secret to set up the project. If you do, tell us: that is a bug.</p>
              </div>
              <div>
                <h3>Where to ask</h3>
                <ul className="link-list">
                  <li>
                    <a href={DISCUSSIONS_URL}>Ask in GitHub Discussions</a> (public, preferred)
                  </li>
                  <li>
                    Private questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </li>
                  <li>
                    <Link href="/contributor-guide/">Read the contributor guide</Link>
                  </li>
                </ul>
                <p className="note">{RESPONSE_EXPECTATION}</p>
              </div>
            </div>
          </section>

          <section className="idea-section words" aria-labelledby="words">
            <h2 id="words">Words used on this page</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: idea.sections["Words used on this page"] }} />
            <p className="note">
              For general terms such as mentor, proposal or pull request, see the <Link href="/glossary/">glossary</Link>.
            </p>
          </section>
        </div>

        <div className="idea-side">
          <section aria-labelledby="skills">
            <h2 id="skills">Skills</h2>
            <ul className="tags">
              {idea.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="mentors">
            <h2 id="mentors">Mentors</h2>
            <ul className="mentor-list">
              {mentors.map(({ person, role }) => (
                <li key={person.github}>
                  <Image src={`https://github.com/${person.github}.png?size=96`} width={48} height={48} alt="" unoptimized />
                  <span>
                    <b>{person.name}</b>
                    <RoleChips roles={[role]} label={`Role of ${person.name} on this idea`} className="chips-small" />
                    <a href={`https://github.com/${person.github}`}>@{person.github}</a>
                  </span>
                </li>
              ))}
            </ul>
            <p className="note">Your primary mentor is your main contact. Your backup mentor can step in.</p>
          </section>

          <section aria-labelledby="related-issues">
            <h2 id="related-issues">Related issues</h2>
            {idea.relatedIssues.length ? (
              <>
                <p className="note">Public bug reports and plans in the repository that this idea builds on.</p>
                <ul className="link-list">
                  {idea.relatedIssues.map((issue) => (
                    <li key={issue.number}>
                      <a href={issue.url}>
                        #{issue.number} {issue.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="note">No issues are linked yet. Ask about this idea in GitHub Discussions.</p>
            )}
          </section>
        </div>
      </div>

      <nav className="idea-pager" aria-label="More ideas">
        <ul>
          {previous && (
            <li className="pager-previous">
              <Link href={`/ideas/${previous.slug}/`} rel="prev">
                <small>
                  <span aria-hidden="true">← </span>Previous idea
                </small>
                <span>{previous.title}</span>
              </Link>
            </li>
          )}
          <li className="pager-all">
            <Link href="/ideas/">All {IDEAS.length} ideas</Link>
          </li>
          {next && (
            <li className="pager-next">
              <Link href={`/ideas/${next.slug}/`} rel="next">
                <small>
                  Next idea<span aria-hidden="true"> →</span>
                </small>
                <span>{next.title}</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <WhatNext links={nextLinks(["/contributor-guide/", "/proposal/", "/selection/"])} />
    </article>
  );
}
