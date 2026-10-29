import Link from "next/link";
import type { Idea } from "@/lib/content";
import { CAPACITY_STATEMENT } from "@/data/site";

export function PageHero({ eyebrow, heading, lead, children }: { eyebrow: string; heading: string; lead: string; children?: React.ReactNode }) {
  return (
    <header className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{heading}</h1>
      <p className="lead">{lead}</p>
      {children}
    </header>
  );
}

export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Capacity() {
  return (
    <p className="capacity">
      <strong>{CAPACITY_STATEMENT}</strong>
    </p>
  );
}

export const sizeLabel = (hours: number) => `${hours} hours`;

export function IdeaTable({ ideas, headingId }: { ideas: Idea[]; headingId: string }) {
  return (
    <div className="table-scroll" role="region" aria-labelledby={headingId} tabIndex={0}>
      <table className="idea-table">
        <caption className="visually-hidden">Project ideas with theme, size, difficulty and mentors</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Idea</th>
            <th scope="col">Theme</th>
            <th scope="col">Size</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Primary mentor</th>
            <th scope="col">Backup mentor</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea) => (
            <tr key={idea.slug}>
              <td>{idea.order}</td>
              <th scope="row">
                <Link href={`/ideas/${idea.slug}/`}>{idea.title}</Link>
              </th>
              <td>{idea.theme}</td>
              <td>{sizeLabel(idea.sizeHours)}</td>
              <td>{idea.difficulty}</td>
              <td>{idea.primaryMentor.name}</td>
              <td>{idea.backupMentor.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IdeaCards({ ideas }: { ideas: Idea[] }) {
  return (
    <ol className="idea-cards">
      {ideas.map((idea) => (
        <li key={idea.slug}>
          <article>
            <p className="card-meta">
              <span>{String(idea.order).padStart(2, "0")}</span> {idea.theme}
            </p>
            <h3>
              <Link href={`/ideas/${idea.slug}/`}>{idea.title}</Link>
            </h3>
            <p>{idea.summary}</p>
            <dl className="card-facts">
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
                  {idea.primaryMentor.name} (primary), {idea.backupMentor.name} (backup)
                </dd>
              </div>
            </dl>
          </article>
        </li>
      ))}
    </ol>
  );
}
