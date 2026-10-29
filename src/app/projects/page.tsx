import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, nextLinks, PageHero, PageLayout, Prose, WhatNext } from "@/components/blocks";
import { getPage, PROJECTS } from "@/lib/content";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID, pageMetadata, stripTags, WEBSITE_ID } from "@/lib/seo";

const page = getPage("projects");

export const metadata: Metadata = pageMetadata({ title: page.title, description: page.description, path: "/projects/", social: "projects" });

export default function ProjectsPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    description: page.description,
    url: absoluteUrl("/projects/"),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: project.name,
          description: stripTags(project.html),
          codeRepository: project.repository,
          programmingLanguage: project.languages,
          url: project.homepage,
          author: { "@id": ORGANIZATION_ID },
        },
      })),
    },
  };
  return (
    <>
      <JsonLd data={[structured, breadcrumbJsonLd([{ name: page.title, path: "/projects/" }])]} />
      <PageHero eyebrow="Projects" heading={page.heading} lead={page.lead} />
      <PageLayout toc={PROJECTS.map((project) => ({ id: project.slug, text: project.name }))}>
        {PROJECTS.map((project) => (
          <section className="page-section project" key={project.slug} aria-labelledby={project.slug}>
            <h2 id={project.slug}>{project.name}</h2>
            <Prose html={project.html} />
            <dl className="project-facts">
              <div>
                <dt>Languages</dt>
                <dd>{project.languages.join(", ")}</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd>{project.stack.join(", ")}</dd>
              </div>
              <div>
                <dt>Repository</dt>
                <dd>
                  <a href={project.repository}>{project.repositoryName}</a> · <a href={project.homepage}>{project.homepage.replace("https://", "")}</a>
                </dd>
              </div>
              <div>
                <dt>Setup and contributing</dt>
                <dd>
                  <a href={`${project.repository}/blob/main/README.md`}>README</a> ·{" "}
                  <a href={`${project.repository}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING</a>
                </dd>
              </div>
              <div>
                <dt>Licence</dt>
                <dd>
                  See the repository&apos;s <a href={`${project.repository}/blob/main/LICENSE`}>LICENSE</a>.
                </dd>
              </div>
              <div>
                <dt>{project.ideas.length === 1 ? "GSoC idea" : "GSoC ideas"}</dt>
                <dd>
                  <ul className="plain-list">
                    {project.ideas.map((idea) => (
                      <li key={idea.slug}>
                        <Link href={`/ideas/${idea.slug}/`}>{idea.title}</Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Mentors</dt>
                <dd>{project.mentors.map((person) => person.name).join(", ")}</dd>
              </div>
            </dl>
          </section>
        ))}
      </PageLayout>
      <WhatNext links={nextLinks(page.next)} />
    </>
  );
}
