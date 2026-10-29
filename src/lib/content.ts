import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { parseFrontmatter, type Frontmatter } from "./frontmatter";
import { getPerson, type Person } from "@/data/people";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const SIZES = [90, 175] as const;
export const DIFFICULTIES = ["Easy", "Easy–Intermediate", "Intermediate", "Intermediate–Hard", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Render trusted Markdown from content/. Tables get a focusable scroll wrapper for small screens. */
export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true }) as string;
  return html
    .replace(/<table>/g, '<div class="table-scroll" role="region" tabindex="0" aria-label="Table (scrolls sideways on small screens)"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

function read(relative: string) {
  const file = path.join(CONTENT_DIR, relative);
  return { file: path.relative(process.cwd(), file), source: fs.readFileSync(file, "utf8") };
}

function str(data: Frontmatter, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value) throw new Error(`${file}: "${key}" must be a non-empty string`);
  return value;
}

function optionalStr(data: Frontmatter, key: string, file: string): string | null {
  const value = data[key];
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new Error(`${file}: "${key}" must be a string or null`);
  return value;
}

function list(data: Frontmatter, key: string, file: string): string[] {
  const value = data[key];
  if (!Array.isArray(value)) throw new Error(`${file}: "${key}" must be a list`);
  return value;
}

/* ----------------------------------------------------------------- pages */

export type Page = {
  slug: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  body: string;
  html: string;
};

export function getPage(slug: string): Page {
  const { file, source } = read(`pages/${slug}.md`);
  const { data, body } = parseFrontmatter(source, file);
  return {
    slug,
    title: str(data, "title", file),
    description: str(data, "description", file),
    heading: str(data, "heading", file),
    lead: str(data, "lead", file),
    body,
    html: renderMarkdown(body),
  };
}

/** Split a Markdown body into `## Heading` sections. */
export function sections(body: string): { heading: string; markdown: string }[] {
  return body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const newline = chunk.indexOf("\n");
      return { heading: chunk.slice(0, newline).trim(), markdown: chunk.slice(newline + 1).trim() };
    });
}

export function getFaq() {
  const page = getPage("faq");
  return {
    page,
    items: sections(page.body).map(({ heading, markdown }) => ({ question: heading, answerHtml: renderMarkdown(markdown) })),
  };
}

/* ----------------------------------------------------------------- ideas */

const IDEA_SECTIONS = ["Problem", "Expected outcomes", "Stretch goals", "Not in scope", "Proof of success", "How to start"] as const;
type IdeaSection = (typeof IDEA_SECTIONS)[number];

export type RelatedIssue = { number: number; title: string; url: string };

export type Idea = {
  slug: string;
  order: number;
  title: string;
  summary: string;
  theme: string;
  sizeHours: (typeof SIZES)[number];
  difficulty: Difficulty;
  primaryMentor: Person;
  backupMentor: Person;
  repository: string;
  repositoryName: string;
  setup: string;
  envExample: string | null;
  skills: string[];
  relatedIssues: RelatedIssue[];
  sections: Record<IdeaSection, string>;
  sourcePath: string;
};

function loadIdea(fileName: string): Idea {
  const { file, source } = read(`ideas/${fileName}`);
  const { data, body } = parseFrontmatter(source, file);
  const slug = str(data, "slug", file);
  if (`${slug}.md` !== fileName) throw new Error(`${file}: slug must match the file name`);

  const size = data.size_hours;
  if (!SIZES.includes(size as (typeof SIZES)[number])) throw new Error(`${file}: size_hours must be one of ${SIZES.join(", ")}`);
  const difficulty = str(data, "difficulty", file);
  if (!DIFFICULTIES.includes(difficulty as Difficulty)) throw new Error(`${file}: unknown difficulty "${difficulty}"`);

  const primaryMentor = getPerson(str(data, "primary_mentor", file));
  const backupMentor = getPerson(str(data, "backup_mentor", file));
  for (const mentor of [primaryMentor, backupMentor]) {
    if (!mentor.isMentor) throw new Error(`${file}: ${mentor.github} is not listed as a mentor in src/data/people.ts`);
  }
  if (primaryMentor.github === backupMentor.github) throw new Error(`${file}: primary and backup mentor must differ`);

  const repository = str(data, "repository", file);
  if (!/^https:\/\/github\.com\/elixpo\/[\w.-]+$/.test(repository)) throw new Error(`${file}: repository must be a github.com/elixpo URL`);

  const relatedIssues = list(data, "related_issues", file).map((entry) => {
    const issue = /^(\d+)\s+(.+)$/.exec(entry);
    if (!issue) throw new Error(`${file}: related_issues entries look like "123 Issue title"`);
    return { number: Number(issue[1]), title: issue[2], url: `${repository}/issues/${issue[1]}` };
  });

  const found = sections(body);
  const headings = found.map((section) => section.heading);
  if (headings.join("|") !== IDEA_SECTIONS.join("|")) {
    throw new Error(`${file}: sections must be exactly, in order: ${IDEA_SECTIONS.join(", ")} (found ${headings.join(", ")})`);
  }

  return {
    slug,
    order: Number(data.order),
    title: str(data, "title", file),
    summary: str(data, "summary", file),
    theme: str(data, "theme", file),
    sizeHours: size as (typeof SIZES)[number],
    difficulty: difficulty as Difficulty,
    primaryMentor,
    backupMentor,
    repository,
    repositoryName: repository.replace("https://github.com/", ""),
    setup: str(data, "setup", file),
    envExample: optionalStr(data, "env_example", file),
    skills: list(data, "skills", file),
    relatedIssues,
    sections: Object.fromEntries(found.map(({ heading, markdown }) => [heading, renderMarkdown(markdown)])) as Record<IdeaSection, string>,
    sourcePath: file,
  };
}

export const IDEAS: Idea[] = fs
  .readdirSync(path.join(CONTENT_DIR, "ideas"))
  .filter((name) => name.endsWith(".md") && name !== "README.md")
  .map(loadIdea)
  .sort((a, b) => a.order - b.order);

export const getIdea = (slug: string) => IDEAS.find((idea) => idea.slug === slug);

export type MentorRole = "Primary mentor" | "Backup mentor";

export function ideasMentoredBy(github: string): { idea: Idea; role: MentorRole }[] {
  return IDEAS.flatMap((idea): { idea: Idea; role: MentorRole }[] => {
    if (idea.primaryMentor.github === github) return [{ idea, role: "Primary mentor" }];
    if (idea.backupMentor.github === github) return [{ idea, role: "Backup mentor" }];
    return [];
  });
}
