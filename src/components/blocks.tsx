import Link from "next/link";
import type { Idea } from "@/lib/content";
import { CAPACITY_STATEMENT, GSOC_LOGO, siteMapEntry } from "@/data/site";
import { jsonLd } from "@/lib/seo";

/** Render one or more JSON-LD objects, each in its own script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(item) }} />
      ))}
    </>
  );
}

export function PageHero({ eyebrow, heading, lead, children }: { eyebrow: string; heading: string; lead: string; children?: React.ReactNode }) {
  return (
    <header className="page-hero">
      <div className="page-hero-title">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{heading}</h1>
      </div>
      <div className="page-hero-lead">
        <p className="lead">{lead}</p>
        {children}
      </div>
    </header>
  );
}

export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Full-width page body: an "On this page" list beside the reading column on
 * wide screens, stacked above it on narrow ones. The reading column keeps a
 * comfortable measure; tables and wide blocks may use the full column.
 */
export function PageLayout({ toc, children }: { toc: { id: string; text: string }[]; children: React.ReactNode }) {
  return (
    <div className={toc.length > 1 ? "page-layout" : "page-layout page-layout-single"}>
      {toc.length > 1 && (
        <nav className="toc" aria-labelledby="toc-heading">
          <h2 id="toc-heading">On this page</h2>
          <ol>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="page-main">{children}</div>
    </div>
  );
}

export function Capacity() {
  return (
    <p className="capacity">
      <strong>{CAPACITY_STATEMENT}</strong>
    </p>
  );
}

/** Roles as small chips. A real list, so the roles are read out as text, not conveyed by colour. */
export function RoleChips({ roles, label = "Roles", className = "" }: { roles: readonly string[]; label?: string; className?: string }) {
  return (
    <ul className={`chips ${className}`.trim()} aria-label={label}>
      {roles.map((role) => (
        <li className="chip" key={role}>
          {role}
        </li>
      ))}
    </ul>
  );
}

/**
 * Google's unmodified GSoC logo, always with a plain label above it and on its
 * own light tile, never in a lockup with the Elixpo mark (Google brand guidelines).
 */
export function GsocMark({ label = "Elixpo is preparing to apply to", note }: { label?: string; note?: React.ReactNode }) {
  return (
    <figure className="gsoc-mark">
      <figcaption>{label}</figcaption>
      <div className="gsoc-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={GSOC_LOGO.src} width={GSOC_LOGO.width} height={GSOC_LOGO.height} alt={GSOC_LOGO.alt} decoding="async" />
      </div>
      {note && <p className="gsoc-note">{note}</p>}
    </figure>
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
            <p>{idea.inShort}</p>
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

export type NextLink = { href: string; label: string; about: string };

/** Turn routes from a page's `next:` frontmatter into links with plain descriptions. */
export const nextLinks = (routes: string[]): NextLink[] => routes.map((href) => ({ ...siteMapEntry(href) }));

/** The short block that ends every page and points to the logical next page(s). */
export function WhatNext({ links }: { links: NextLink[] }) {
  return (
    <nav className="what-next" aria-labelledby="what-next">
      <h2 id="what-next">What next?</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
            <span>{link.about}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
