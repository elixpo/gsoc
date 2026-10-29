import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, nextLinks, PageHero, Prose, RoleChips, WhatNext } from "@/components/blocks";
import { PeopleTable } from "@/components/PeopleTable";
import { PEOPLE } from "@/data/people";
import { getPage, ideasMentoredBy } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const page = getPage("people");

export const metadata: Metadata = pageMetadata({ title: page.title, description: page.description, path: "/people/", social: "people" });

export default function PeoplePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: "/people/" }])} />
      <PageHero eyebrow="People" headingHtml={page.headingHtml} lead={page.lead} />
      <section className="content content-split" aria-labelledby="roles">
        <Prose html={page.html} />
      </section>
      <section className="content" aria-labelledby="people-list">
        <h2 id="people-list" className="visually-hidden">
          Mentors, administrators and coordinator
        </h2>
        <ul className="hairline-grid people-grid">
          {PEOPLE.map((person) => {
            const mentored = ideasMentoredBy(person.github);
            return (
              <li key={person.github}>
                <article aria-labelledby={`person-${person.github}`}>
                  <Image src={`https://github.com/${person.github}.png?size=192`} width={96} height={96} alt="" unoptimized />
                  <div>
                    <h3 id={`person-${person.github}`}>{person.name}</h3>
                    <RoleChips roles={person.roles} label={`Roles of ${person.name}`} />
                    <p>{person.about}</p>
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
                    <p className="person-links">
                      <a href={`https://github.com/${person.github}`}>GitHub: @{person.github}</a>
                      <span>{person.email ? <a href={`mailto:${person.email}`}>{person.email}</a> : <span className="muted">Email coming soon</span>}</span>
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="content" aria-labelledby="people-table">
        <h2 id="people-table">Roles at a glance</h2>
        <PeopleTable headingId="people-table" />
      </section>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
