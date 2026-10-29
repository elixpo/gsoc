import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { parseFrontmatter, type Frontmatter } from "./frontmatter";
import { getPerson, type Person } from "@/data/people";
import { CONFIG_ACCESS_MARKDOWN } from "@/data/site";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const SIZES = [90, 175] as const;
export const DIFFICULTIES = ["Easy", "Intermediate", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Stable anchor for a heading, e.g. "1. About you" -> "about-you". */
export const slugify = (text: string) =>
  text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/&[a-z]+;|&#\d+;/g, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/\W+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Render trusted Markdown from content/. Second-level headings get ids, so the
 * "On this page" list can link to them. HTML comments are dropped. Tables get a focusable scroll wrapper
 * for small screens.
 */
export function renderMarkdown(markdown: string): string {
  // Editorial notes (<!-- TODO ... -->) stay in the source, not in the published page.
  const html = marked.parse(markdown.replace(/<!--[\s\S]*?-->\n?/g, ""), { async: false, gfm: true }) as string;
  return html
    .replace(/<h2>(.*?)<\/h2>/g, (_match, inner: string) => `<h2 id="${slugify(inner)}">${inner}</h2>`)
    .replace(/<table>/g, '<div class="table-scroll" role="region" tabindex="0" aria-label="Table (scrolls sideways on small screens)"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

/** Shared Markdown blocks, included in content/ with `<!-- shared: name -->` on a line of its own. */
const SHARED_BLOCKS: Record<string, string> = {
  "configuration-and-access": CONFIG_ACCESS_MARKDOWN,
};

function expandShared(markdown: string, file: string): string {
  return markdown.replace(/^<!-- shared: ([\w-]+) -->$/gm, (_match, name: string) => {
    const block = SHARED_BLOCKS[name];
    if (block === undefined) throw new Error(`${file}: unknown shared block "${name}"`);
    return block;
  });
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

function list(data: Frontmatter, key: string, file: string): string[] {
  const value = data[key];
  if (!Array.isArray(value)) throw new Error(`${file}: "${key}" must be a list`);
  return value;
}

/* ----------------------------------------------------------------- pages */

export const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Escape a heading and turn `*phrase*` into `<em>phrase</em>`, the italic serif accent. */
export const accentHeading = (heading: string) => escapeHtml(heading).replace(/\*([^*]+)\*/g, "<em>$1</em>");

/**
 * Items of a Markdown ordered list written as `1. **Title**: description`, for
 * the numbered step grids. The title keeps its inline Markdown (links).
 */
export function steps(markdown: string): { titleHtml: string; textHtml: string }[] {
  return markdown
    .split(/^\d+\.\s+/m)
    .slice(1)
    .map((item) => {
      const match = /^\*\*([\s\S]+?)\*\*:?\s*([\s\S]*)$/.exec(item.trim().replace(/\s+/g, " "));
      if (!match) throw new Error(`Step "${item.trim()}" must look like "**Title**: description"`);
      const text = match[2].replace(/^./, (letter) => letter.toUpperCase());
      return { titleHtml: marked.parseInline(match[1], { async: false }) as string, textHtml: marked.parseInline(text, { async: false }) as string };
    });
}

export type Page = {
  slug: string;
  title: string;
  description: string;
  /** Plain-text heading (accent markers removed). */
  heading: string;
  /** Heading as HTML: `*phrase*` in the frontmatter becomes the italic serif accent. */
  headingHtml: string;
  lead: string;
  body: string;
  html: string;
  /** Routes for the "What next?" block at the end of the page. */
  next: string[];
  /** The TL;DR row near the top of the page: 3-6 numbered points, as inline HTML (empty on TLDR_EXEMPT pages). */
  tldrHtml: string[];
};

/** Pages without a TL;DR: the timeline is only the (coming soon) timeline and a call to action. */
export const TLDR_EXEMPT = ["timeline"] as const;
export const TLDR_MIN = 3;
export const TLDR_MAX = 6;

/**
 * Inline Markdown for the TL;DR row (links and emphasis), via the same marked
 * setup as the page bodies; the content is trusted Markdown from content/.
 * Checked for length so every page stays scannable.
 */
export function tldr(items: string[], file: string): string[] {
  if (items.length < TLDR_MIN || items.length > TLDR_MAX) throw new Error(`${file}: "tldr" must have ${TLDR_MIN} to ${TLDR_MAX} items (found ${items.length})`);
  return items.map((item) => marked.parseInline(item, { async: false }) as string);
}

function pageTldr(slug: string, data: Frontmatter, file: string): string[] {
  const exempt = (TLDR_EXEMPT as readonly string[]).includes(slug);
  if (exempt) {
    if ("tldr" in data) throw new Error(`${file}: this page has no TL;DR; remove "tldr"`);
    return [];
  }
  return tldr(list(data, "tldr", file), file);
}

export function getPage(slug: string): Page {
  const { file, source } = read(`pages/${slug}.md`);
  const { data, body: rawBody } = parseFrontmatter(source, file);
  const body = expandShared(rawBody, file);
  return {
    slug,
    title: str(data, "title", file),
    description: str(data, "description", file),
    heading: str(data, "heading", file).replace(/\*/g, ""),
    headingHtml: accentHeading(str(data, "heading", file)),
    lead: str(data, "lead", file),
    body,
    html: renderMarkdown(body),
    next: list(data, "next", file),
    tldrHtml: pageTldr(slug, data, file),
  };
}

/** The second-level headings of rendered Markdown, for an "On this page" list. */
export function tableOfContents(html: string): { id: string; text: string }[] {
  return [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map((match) => ({ id: match[1], text: match[2].replace(/<[^>]+>/g, "") }));
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

export type HistoryEntry = { date: string; title: string; html: string };

/**
 * The about page: Markdown sections, with the "Our history, step by step"
 * section split into dated entries (`### Date — Title`).
 */
export function getAbout() {
  const page = getPage("about");
  return {
    page,
    sections: sections(page.body).map(({ heading, markdown }) => {
      const [intro, ...chunks] = markdown.split(/^### /m);
      const history: HistoryEntry[] = chunks.map((chunk) => {
        const newline = chunk.indexOf("\n");
        const [date, title] = chunk.slice(0, newline).split(" — ");
        if (!title) throw new Error(`content/pages/about.md: history headings look like "### Date — Title" (found "${chunk.slice(0, newline)}")`);
        return { date: date.trim(), title: title.trim(), html: renderMarkdown(chunk.slice(newline + 1).trim()) };
      });
      return { heading, id: slugify(heading), html: renderMarkdown(intro.trim()), history };
    }),
  };
}

/** A page whose `##` headings are questions: the FAQ and "Why Elixpo". */
export function getQuestions(slug: string) {
  const page = getPage(slug);
  return {
    page,
    items: sections(page.body).map(({ heading, markdown }) => ({ question: heading, answerHtml: renderMarkdown(markdown) })),
  };
}

export const getFaq = () => getQuestions("faq");

/* ----------------------------------------------------------------- ideas */

/**
 * Sections of an idea file, in order. The page renders them in the field order
 * established GSoC organisations use, with Material, Skills, Size, Difficulty
 * and Mentors built from the frontmatter.
 */
export const IDEA_SECTIONS = [
  "Description",
  "Expected outcomes",
  "Stretch goals",
  "Out of scope",
  "How success is measured",
  "Warm-up tasks",
  "Terms used on this page",
] as const;
export type IdeaSection = (typeof IDEA_SECTIONS)[number];

export type RelatedIssue = { number: number; title: string; url: string };

export type Idea = {
  slug: string;
  order: number;
  title: string;
  summary: string;
  /** One plain-language sentence for readers new to the topic. */
  inShort: string;
  theme: string;
  sizeHours: (typeof SIZES)[number];
  difficulty: Difficulty;
  primaryMentor: Person;
  backupMentor: Person;
  repository: string;
  repositoryName: string;
  setup: string;
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

  // Elixpo keeps configuration encrypted with SOPS; ideas do not link .env example files.
  if ("env_example" in data) throw new Error(`${file}: remove "env_example"; see "Configuration and access" in content/pages/contributor-guide.md`);

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
    inShort: str(data, "in_short", file),
    theme: str(data, "theme", file),
    sizeHours: size as (typeof SIZES)[number],
    difficulty: difficulty as Difficulty,
    primaryMentor,
    backupMentor,
    repository,
    repositoryName: repository.replace("https://github.com/", ""),
    setup: str(data, "setup", file),
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

/** The ideas before and after this one in the list, if any. */
export function neighbours(slug: string): { previous?: Idea; next?: Idea } {
  const index = IDEAS.findIndex((idea) => idea.slug === slug);
  return { previous: index > 0 ? IDEAS[index - 1] : undefined, next: index >= 0 && index < IDEAS.length - 1 ? IDEAS[index + 1] : undefined };
}

export type MentorRole = "Primary mentor" | "Backup mentor";

export function ideasMentoredBy(github: string): { idea: Idea; role: MentorRole }[] {
  return IDEAS.flatMap((idea): { idea: Idea; role: MentorRole }[] => {
    if (idea.primaryMentor.github === github) return [{ idea, role: "Primary mentor" }];
    if (idea.backupMentor.github === github) return [{ idea, role: "Backup mentor" }];
    return [];
  });
}

/* -------------------------------------------------------------- projects */

export type Project = {
  slug: string;
  order: number;
  name: string;
  repository: string;
  repositoryName: string;
  /** The live product or project site (checked to return HTTP 200). */
  homepage: string;
  /** The project's page on elixpo.com: `publication.canonical_url` in the repository's .elixpo/project.yml. */
  elixpoPage: string;
  /** Languages GitHub reports for the repository, largest first. */
  languages: string[];
  stack: string[];
  html: string;
  ideas: Idea[];
  mentors: Person[];
};

function loadProject(fileName: string): Project {
  const { file, source } = read(`projects/${fileName}`);
  const { data, body } = parseFrontmatter(source, file);
  const slug = str(data, "slug", file);
  if (`${slug}.md` !== fileName) throw new Error(`${file}: slug must match the file name`);
  const repository = str(data, "repository", file);
  if (!/^https:\/\/github\.com\/elixpo\/[\w.-]+$/.test(repository)) throw new Error(`${file}: repository must be a github.com/elixpo URL`);
  const ideas = IDEAS.filter((idea) => idea.repository === repository);
  if (!ideas.length) throw new Error(`${file}: no idea uses ${repository}`);
  const mentors = [...new Map(ideas.flatMap((idea) => [idea.primaryMentor, idea.backupMentor]).map((person) => [person.github, person])).values()];
  return {
    slug,
    order: Number(data.order),
    name: str(data, "name", file),
    repository,
    repositoryName: repository.replace("https://github.com/", ""),
    homepage: str(data, "homepage", file),
    elixpoPage: str(data, "elixpo_page", file),
    languages: list(data, "languages", file),
    stack: list(data, "stack", file),
    html: renderMarkdown(body.trim()),
    ideas,
    mentors,
  };
}

/** The participating project an idea belongs to. */
export const projectOf = (idea: Idea): Project => {
  const project = PROJECTS.find((entry) => entry.repository === idea.repository);
  if (!project) throw new Error(`No project in content/projects/ for ${idea.repository}`);
  return project;
};

export const PROJECTS: Project[] = fs
  .readdirSync(path.join(CONTENT_DIR, "projects"))
  .filter((name) => name.endsWith(".md"))
  .map(loadProject)
  .sort((a, b) => a.order - b.order);

for (const idea of IDEAS) {
  if (!PROJECTS.some((project) => project.repository === idea.repository)) {
    throw new Error(`${idea.sourcePath}: no file in content/projects/ describes ${idea.repository}`);
  }
}

/** Anchor of the project on /projects/ that hosts a repository. */
export function projectAnchor(repository: string): string {
  const project = PROJECTS.find((entry) => entry.repository === repository);
  if (!project) throw new Error(`No project in content/projects/ for ${repository}`);
  return project.slug;
}
