import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, nextLinks, PageHero, Prose, RoleChips, WhatNext } from "@/components/blocks";
import { ContactChips, PeopleTable } from "@/components/PeopleTable";
import { PEOPLE } from "@/data/people";
import { getPage, ideasMentoredBy } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const page = getPage("mentors");

export const metadata: Metadata = pageMetadata({ title: page.title, description: page.description, path: "/mentors/", social: "mentors" });

export default function MentorsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: "/mentors/" }])} />
      <PageHero eyebrow="Mentors" headingHtml={page.headingHtml} lead={page.lead} />
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
