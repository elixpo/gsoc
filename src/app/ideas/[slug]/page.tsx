import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sizeLabel } from "@/components/blocks";
import { getIdea, IDEAS } from "@/lib/content";
import { DISCUSSIONS_URL, RESPONSE_EXPECTATION } from "@/data/site";
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

function Section({ id, title, html }: { id: string; title: string; html: string }) {
  return (
    <section className="idea-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}

export default async function IdeaPage({ params }: Props) {
  const idea = getIdea((await params).slug);
  if (!idea) notFound();

  const url = absoluteUrl(`/ideas/${idea.slug}/`);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Elixpo GSoC", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Project ideas", item: absoluteUrl("/ideas/") },
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
            <Link href="/ideas/">Project ideas</Link>
          </li>
          <li aria-current="page">{idea.title}</li>
        </ol>
      </nav>

      <header className="idea-hero">
        <div>
          <p className="eyebrow">
            Idea {idea.order} of {IDEAS.length} · {idea.theme}
          </p>
          <h1>{idea.title}</h1>
          <p className="lead">{idea.summary}</p>
        </div>
        <aside className="idea-facts" aria-label="Idea summary">
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
        </aside>
      </header>

      <div className="idea-body">
        <div className="idea-main">
          <Section id="problem" title="Problem" html={idea.sections["Problem"]} />
          <Section id="outcomes" title="Expected outcomes" html={idea.sections["Expected outcomes"]} />
          <Section id="stretch" title="Stretch goals" html={idea.sections["Stretch goals"]} />
          <Section id="not-in-scope" title="Not in scope" html={idea.sections["Not in scope"]} />
          <Section id="proof" title="Proof of success" html={idea.sections["Proof of success"]} />
          <Section id="how-to-start" title="How to start" html={idea.sections["How to start"]} />
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
                    <small>
                      {role} · <a href={`https://github.com/${person.github}`}>@{person.github}</a>
                    </small>
                  </span>
                </li>
              ))}
            </ul>
            <p className="note">{RESPONSE_EXPECTATION}</p>
          </section>

          <section aria-labelledby="repository">
            <h2 id="repository">Repository and setup</h2>
            <ul className="link-list">
              <li>
                <a href={idea.repository}>{idea.repositoryName}</a>
              </li>
              <li>
                <a href={idea.setup}>Setup instructions (README)</a>
              </li>
              {idea.envExample && (
                <li>
                  <a href={idea.envExample}>Example environment file (.env.example)</a>
                </li>
              )}
              <li>
                <a href={`${idea.repository}/blob/main/CONTRIBUTING.md`}>Contributing guide</a>
              </li>
            </ul>
            <p className="note">You should not need any Elixpo secret to set up the project. If you do, tell us.</p>
          </section>

          <section aria-labelledby="related-issues">
            <h2 id="related-issues">Related issues</h2>
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
              <p className="note">No issues are linked yet. Ask about this idea in GitHub Discussions.</p>
            )}
          </section>

          <section aria-labelledby="ask">
            <h2 id="ask">Questions?</h2>
            <p>
              Ask in <a href={DISCUSSIONS_URL}>GitHub Discussions</a>, then read the <Link href="/contributor-guide/">contributor guide</Link> and{" "}
              <Link href="/proposal/">proposal template</Link>.
            </p>
          </section>
        </div>
      </div>

      <p>
        <Link className="back" href="/ideas/">
          ← All project ideas
        </Link>
      </p>
    </article>
  );
}
