import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroGeometry, nextLinks, RoleChips, sizeLabel, Tldr, WhatNext } from "@/components/blocks";
import { escapeHtml, getIdea, IDEAS, neighbours, projectAnchor, projectOf, type Idea, type IdeaSection } from "@/lib/content";
import { CONFIG_ACCESS_ANCHOR, CONTACT_EMAIL, DISCUSSIONS_NOTE_SHORT, RESPONSE_EXPECTATION, SETUP_NOTE } from "@/data/site";
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

/** One-line explanations shown under each section heading. */
const HINTS: Partial<Record<IdeaSection, string>> = {
  Description: "The problem this idea addresses and why it matters.",
  "Expected outcomes": "What must exist at the end of the project.",
  "Stretch goals": "Optional work, attempted only once the expected outcomes are complete.",
  "Out of scope": "Work that is not part of this project, even if it appears related.",
  "How success is measured": "The checks that confirm the work is complete.",
  "Warm-up tasks": "Complete at least one before you submit a proposal, and share the result as a pull request or by email to the programme address.",
};

/** Section ids, in page order, for the "On this page" list. */
const TOC = [
  { id: "description", text: "Description" },
  { id: "outcomes", text: "Expected outcomes" },
  { id: "stretch", text: "Stretch goals" },
  { id: "out-of-scope", text: "Out of scope" },
  { id: "success", text: "How success is measured" },
  { id: "material", text: "Material" },
  { id: "warm-up-tasks", text: "Warm-up tasks" },
  { id: "details", text: "Skills, size and mentors" },
  { id: "terms", text: "Terms used on this page" },
];

/** The idea's TL;DR, built from its frontmatter so it always matches the page. */
function ideaTldr(idea: Idea): string[] {
  return [
    `<strong>In short:</strong> ${escapeHtml(idea.inShort)}`,
    `${sizeLabel(idea.sizeHours)} · ${idea.difficulty} · ${escapeHtml(idea.theme)}`,
    `Mentors: ${escapeHtml(idea.primaryMentor.name)} (primary) and ${escapeHtml(idea.backupMentor.name)} (backup).`,
    `First step: set up <a href="${idea.setup}">${escapeHtml(idea.repositoryName)}</a> from its README, then pick a <a href="#warm-up-tasks">warm-up task</a>.`,
    `Questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`,
  ];
}

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
  const project = projectOf(idea);
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

      <header className="idea-hero hero-card">
        <HeroGeometry />
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
        <div className="idea-hero-copy">
          <p className="eyebrow">
            Idea {idea.order} of {IDEAS.length} · {idea.theme}
          </p>
          <h1>{idea.title}</h1>
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
            <div>
              <dt>Product site</dt>
              <dd>
                <a href={project.homepage}>{project.homepage.replace("https://", "")}</a>
              </dd>
            </div>
            <div>
              <dt>Project page on elixpo.com</dt>
              <dd>
                <a href={project.elixpoPage}>{project.elixpoPage.replace("https://", "")}</a>
              </dd>
            </div>
          </dl>
          <p className="note">
            <a href="#warm-up-tasks">Warm-up tasks</a> · <Link href="/glossary/">Glossary</Link>
          </p>
        </aside>
      </header>
      <Tldr items={ideaTldr(idea)} />

      <div className="idea-body">
        <nav className="toc" aria-labelledby="toc-heading">
          <h2 id="toc-heading">On this page</h2>
          <ol>
            {TOC.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="idea-main">
          <Section id="description" title="Description" html={idea.sections["Description"]} />
          <Section id="outcomes" title="Expected outcomes" html={idea.sections["Expected outcomes"]} />
          <Section id="stretch" title="Stretch goals" html={idea.sections["Stretch goals"]} />
          <Section id="out-of-scope" title="Out of scope" html={idea.sections["Out of scope"]} />
          <Section id="success" title="How success is measured" html={idea.sections["How success is measured"]} />

          <section className="idea-section" aria-labelledby="material">
            <h2 id="material">Material</h2>
            <p className="section-hint">The code, documentation and issues this idea builds on.</p>
            <div className="material">
              <div>
                <h3>Code and documentation</h3>
                <ul className="link-list">
                  <li>
                    Repository: <a href={idea.repository}>{idea.repositoryName}</a>
                  </li>
                  <li>
                    <a href={idea.setup}>Setup instructions (README)</a>
                  </li>
                  <li>
                    <a href={`${idea.repository}/blob/main/CONTRIBUTING.md`}>Contribution guidelines (CONTRIBUTING)</a>
                  </li>
                  <li>
                    <Link href={`/projects/#${projectAnchor(idea.repository)}`}>Project overview</Link>
                  </li>
                </ul>
                <p className="note">
                  {SETUP_NOTE} If a step asks for a secret, report it as a setup issue. See{" "}
                  <Link href={CONFIG_ACCESS_ANCHOR}>configuration and access</Link>.
                </p>
              </div>
              <div>
                <h3>Related issues</h3>
                {idea.relatedIssues.length ? (
                  <ul className="link-list">
                    {idea.relatedIssues.map((issue) => (
                      <li key={issue.number}>
                        <a href={issue.url}>
                          #{issue.number} {issue.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="note">
                    No issues are linked to this idea yet. Ask about it at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                )}
              </div>
            </div>
          </section>

          <Section id="warm-up-tasks" title="Warm-up tasks" html={idea.sections["Warm-up tasks"]} />

          <section className="idea-section" aria-labelledby="details">
            <h2 id="details">Skills, size and mentors</h2>
            <dl className="idea-details">
              <div>
                <dt>Skills</dt>
                <dd>
                  <ul className="tags">
                    {idea.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{sizeLabel(idea.sizeHours)}</dd>
              </div>
              <div>
                <dt>Difficulty</dt>
                <dd>{idea.difficulty}</dd>
              </div>
              <div>
                <dt>Mentors</dt>
                <dd>
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
                </dd>
              </div>
            </dl>
            <p className="note">
              The primary mentor is the contributor&apos;s main contact; the backup mentor can step in. Send questions about this idea or the
              programme to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, and report defects as an issue in the{" "}
              <a href={idea.repository}>repository</a>. {RESPONSE_EXPECTATION} {DISCUSSIONS_NOTE_SHORT}
            </p>
          </section>

          <section className="idea-section terms" aria-labelledby="terms">
            <h2 id="terms">Terms used on this page</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: idea.sections["Terms used on this page"] }} />
            <p className="note">
              General terms such as mentor, proposal and pull request are defined in the <Link href="/glossary/">glossary</Link>.
            </p>
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
