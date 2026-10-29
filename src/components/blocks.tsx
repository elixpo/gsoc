import Link from "next/link";
import type { Idea } from "@/lib/content";
import { CAPACITY_STATEMENT, GSOC_LOGO, GSOC_LOGO_LABEL, siteMapEntry } from "@/data/site";
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

/**
 * Decorative shapes behind a hero card: real elements (no ::before/::after),
 * hidden from assistive technology.
 */
export function HeroGeometry() {
  return (
    <div className="hero-geometry" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

/**
 * The page hero: a rounded card on a soft tinted gradient. `headingHtml` is
 * trusted HTML from the page frontmatter, where `*phrase*` becomes the italic
 * serif accent (see accentHeading in src/lib/content.ts).
 */
export function PageHero({ eyebrow, headingHtml, lead, children, aside }: { eyebrow: string; headingHtml: string; lead: string; children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <header className={aside ? "page-hero page-hero-with-aside hero-card" : "page-hero hero-card"}>
      <HeroGeometry />
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 dangerouslySetInnerHTML={{ __html: headingHtml }} />
        <p className="lead">{lead}</p>
        {children}
      </div>
      {aside}
    </header>
  );
}

/**
 * The TL;DR row under the hero: the page summary, spanning the content width,
 * with a mono label and three to six numbered points (from `tldr:` in the page
 * frontmatter, rendered as inline Markdown). The last point links back to the
 * relevant project idea(s). Hairline rules only, no shadow.
 */
export function Tldr({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside className="content tldr-wrap" aria-label="TL;DR: the short version">
      <div className="tldr">
        <p className="tldr-label">TL;DR</p>
        <ol>
          {items.map((html) => (
            <li key={html} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </ol>
      </div>
    </aside>
  );
}

export type Cta = { href: string; label: string };

/** A call-to-action link: internal routes and anchors use next/link, external ones a plain anchor. */
function CtaLink({ href, label }: Cta) {
  if (/^(https?:|mailto:)/.test(href)) {
    return (
      <a href={href} rel={href.startsWith("http") ? "noopener" : undefined}>
        {label}
        {href.startsWith("http") && (
          <>
            {"\u00a0"}
            <span aria-hidden="true">↗</span>
          </>
        )}
      </a>
    );
  }
  return <Link href={href}>{label}</Link>;
}

/** A row of call-to-action buttons; the first is the dark primary button. */
export function CtaActions({ links }: { links: Cta[] }) {
  return (
    <div className="actions">
      {links.map((link) => (
        <CtaLink key={link.href} {...link} />
      ))}
    </div>
  );
}

/** A closing call-to-action band inside a page body (used on /timeline/). */
export function CtaBlock({ id, title, text, links }: { id: string; title: string; text: string; links: Cta[] }) {
  return (
    <section className="page-section cta-block" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <p>{text}</p>
      <CtaActions links={links} />
    </section>
  );
}

export type HeroFact = { label: string; value: React.ReactNode };

/**
 * The card on the right of an inner page hero: a few crucial facts from the
 * page and one next action. One component for every page, so the cards look
 * the same: hairline border, no shadow, vertically centred beside the copy,
 * stacked under it on small screens. Use only facts already on the site.
 */
export function HeroCard({
  label,
  title,
  stats = [],
  facts = [],
  points = [],
  cta,
  note,
}: {
  label: string;
  title: string;
  /** Large numerals, as on the mentors page. */
  stats?: { value: number | string; label: string }[];
  facts?: HeroFact[];
  points?: React.ReactNode[];
  cta?: Cta;
  note?: React.ReactNode;
}) {
  return (
    <aside className="hero-panel hero-facts" aria-label={label}>
      <p className="eyebrow">{title}</p>
      {stats.length > 0 && (
        <dl className="hero-stats">
          {stats.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {facts.length > 0 && (
        <dl className="hero-fact-list">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {points.length > 0 && (
        <ul className="summary-points">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}
      {cta && (
        <p className="hero-cta">
          <CtaLink {...cta} />
        </p>
      )}
      {note && <p className="hero-panel-note">{note}</p>}
    </aside>
  );
}

export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Pages with fewer sections than this show no "On this page" list. */
const TOC_MIN = 3;

/**
 * Full-width page body: a narrow "On this page" list beside the main column on
 * wide screens, stacked above it on narrow ones. Prose keeps a readable
 * measure; tables, cards and grids may use the full main column.
 */
export function PageLayout({ toc, children }: { toc: { id: string; text: string }[]; children: React.ReactNode }) {
  const showToc = toc.length >= TOC_MIN;
  return (
    <div className={showToc ? "page-layout" : "page-layout page-layout-single"}>
      {showToc && (
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

/** The planned intake, stated plainly (Google's mentor guide asks for it at the top of the ideas list). */
export function Capacity() {
  return <p className="capacity">{CAPACITY_STATEMENT}</p>;
}

/** A numbered 01, 02, ... grid of steps with hairline dividers. */
export function StepGrid({ steps, label }: { steps: { titleHtml: string; textHtml: string }[]; label: string }) {
  return (
    <ol className="hairline-grid step-grid" aria-label={label}>
      {steps.map((step, index) => (
        <li key={step.titleHtml}>
          <span className="cell-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="step-title" dangerouslySetInnerHTML={{ __html: step.titleHtml }} />
          <p className="step-text" dangerouslySetInnerHTML={{ __html: step.textHtml }} />
        </li>
      ))}
    </ol>
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
export function GsocMark({ label = GSOC_LOGO_LABEL, note }: { label?: string; note?: React.ReactNode }) {
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
    <ol className="hairline-grid idea-cards">
      {ideas.map((idea) => (
        <li key={idea.slug}>
          <article>
            <p className="card-meta">
              <span className="cell-number">{String(idea.order).padStart(2, "0")}</span> {idea.theme}
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

/** The "Next steps" block that ends every page and points to the logical next page(s). */
export function WhatNext({ links }: { links: NextLink[] }) {
  return (
    <nav className="what-next" aria-labelledby="what-next">
      <h2 id="what-next">Next steps</h2>
      <ul className="hairline-grid">
        {links.map((link, index) => (
          <li key={link.href}>
            <span className="cell-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Link href={link.href}>{link.label}</Link>
            <span>{link.about}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
