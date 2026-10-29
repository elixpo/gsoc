import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, nextLinks, PageHero, Prose, RoleChips, WhatNext } from "@/components/blocks";
import { ContactChips, PeopleTable } from "@/components/PeopleTable";
import { PEOPLE } from "@/data/people";
import { getPage, IDEAS, ideasMentoredBy } from "@/lib/content";
import { CONTACT_EMAIL } from "@/data/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const page = getPage("mentors");

export const metadata: Metadata = pageMetadata({ title: page.title, description: page.description, path: "/mentors/", social: "mentors" });

const hasRole = (role: string) => PEOPLE.filter((person) => person.roles.some((r) => r.toLowerCase().includes(role))).length;

const SUMMARY = [
  { value: PEOPLE.filter((person) => person.isMentor).length, label: "mentors" },
  { value: IDEAS.length, label: "project ideas" },
  { value: 2, label: "mentors on every idea" },
  { value: hasRole("organisation administrator"), label: "admins" },
];

function MentorsSummary() {
  return (
    <aside className="hero-panel" aria-label="Mentoring at a glance">
      <p className="eyebrow">At a glance</p>
      <dl className="hero-stats">
        {SUMMARY.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="summary-points">
        <li>Every idea has a primary and a backup mentor.</li>
        <li>Mentors reply within 48 hours on weekdays.</li>
        <li>A programme coordinator answers general questions.</li>
      </ul>
      <p className="hero-panel-note">
        Programme questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </aside>
  );
}

export default function MentorsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: "/mentors/" }])} />
      <PageHero eyebrow="Mentors" headingHtml={page.headingHtml} lead={page.lead} aside={<MentorsSummary />}>
        <div className="actions">
          <a href="#people-list">Meet the mentors</a>
          <a href="https://me.elixpo.com/" rel="noopener">
            Member portfolios{"\u00a0"}<span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="hero-subnote">
          Every mentor and organiser signs a public commitment. <Link href="/agreements/">Read the agreements</Link>.
        </p>
      </PageHero>
      <section className="content roles-overview" aria-labelledby="roles">
        <Prose html={page.html} />
      </section>
      <section className="content" aria-labelledby="people-list">
        <h2 id="people-list">Profiles</h2>
        <ol className="mentor-rows">
          {PEOPLE.map((person) => {
            const mentored = ideasMentoredBy(person.github);
            return (
              <li key={person.github}>
                <article className="mentor-row" aria-labelledby={`person-${person.github}`}>
                  <div className="mentor-id">
                    <Image src={`https://github.com/${person.github}.png?size=192`} width={88} height={88} alt="" unoptimized />
                    <div>
                      <h3 id={`person-${person.github}`}>{person.name}</h3>
                      {person.elixpoRole ? <p className="mentor-elixpo-role">{person.elixpoRole}, Elixpo</p> : null}
                      <RoleChips roles={person.roles} label={`Roles of ${person.name}`} />
                    </div>
                  </div>
                  <div className="mentor-body">
                    <p>{person.bio}</p>
                    {person.isMentor && mentored.length > 0 && (
                      <>
                        <h4>Ideas</h4>
                        <ul className="mentored-ideas">
                          {mentored.map(({ idea, role }) => (
                            <li key={idea.slug}>
                              <Link href={`/ideas/${idea.slug}/`}>{idea.title}</Link>
                              <RoleChips roles={[role]} label="Role on this idea" className="chips-small" />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div className="mentor-contact">
                    <h4>Contact</h4>
                    <ContactChips person={person} portfolio />
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="content" aria-labelledby="people-table">
        <h2 id="people-table">Roles at a glance</h2>
        <PeopleTable headingId="people-table" />
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
