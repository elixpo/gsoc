import Link from "next/link";
import { HeroCard, sizeLabel } from "@/components/blocks";
import { CopyEmail } from "@/components/CopyEmail";
import { PEOPLE } from "@/data/people";
import { CONTACT_EMAIL, GSOC_TIMELINE_URL, GSOC_URL, MENTORS_PER_IDEA, PLANNED_CONTRIBUTORS, RESPONSE_EXPECTATION } from "@/data/site";
import { AGREEMENT_ROWS } from "@/lib/agreements";
import { DIFFICULTIES, IDEAS, PROJECTS, SIZES } from "@/lib/content";

/*
 * The hero card of every inner page: the page's crucial facts and one next
 * action, built from the same data as the page body so the two cannot drift.
 * The home page has its own panel (GSoC logo and stats); /timeline/ has none.
 */

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
const hasRole = (role: string) => PEOPLE.filter((person) => person.roles.some((r) => r.toLowerCase().includes(role))).length;
const mentorCount = PEOPLE.filter((person) => person.isMentor).length;

/** "4 × 175 hours, 2 × 90 hours", largest first. */
const sizeMix = [...SIZES]
  .reverse()
  .map((hours) => ({ hours, n: IDEAS.filter((idea) => idea.sizeHours === hours).length }))
  .filter(({ n }) => n > 0)
  .map(({ hours, n }) => `${n} × ${sizeLabel(hours)}`)
  .join(", ");
/** "1 Easy, 3 Intermediate, 2 Hard". */
const difficultyMix = DIFFICULTIES.map((level) => ({ level, n: IDEAS.filter((idea) => idea.difficulty === level).length }))
  .filter(({ n }) => n > 0)
  .map(({ level, n }) => `${n} ${level}`)
  .join(", ");
/** The main (largest) language of each codebase, without repeats. */
const mainLanguages = [...new Set(PROJECTS.map((project) => project.languages[0]))].join(", ");
const projectNames = PROJECTS.map((project) => project.name).join(", ");

const CARDS: Record<string, () => React.ReactNode> = {
  ideas: () => (
    <HeroCard
      label="The ideas at a glance"
      title="At a glance"
      stats={[
        { value: IDEAS.length, label: "project ideas" },
        { value: PROJECTS.length, label: "codebases" },
        { value: MENTORS_PER_IDEA, label: "mentors on every idea" },
      ]}
      facts={[
        { label: "Sizes", value: sizeMix },
        { label: "Difficulty", value: difficultyMix },
      ]}
      cta={{ href: "/contributor-guide/", label: "How to apply" }}
    />
  ),
  projects: () => (
    <HeroCard
      label="The codebases at a glance"
      title="At a glance"
      stats={[
        { value: PROJECTS.length, label: "codebases" },
        { value: IDEAS.length, label: "project ideas" },
      ]}
      facts={[
        { label: "Codebases", value: projectNames },
        { label: "Main languages", value: mainLanguages },
        { label: "Keys needed", value: "None, to set up or warm up" },
      ]}
      cta={{ href: "/warm-up/", label: "Set up without keys" }}
    />
  ),
  mentors: () => (
    <HeroCard
      label="Mentoring at a glance"
      title="At a glance"
      stats={[
        { value: mentorCount, label: "mentors" },
        { value: IDEAS.length, label: "project ideas" },
        { value: MENTORS_PER_IDEA, label: "mentors on every idea" },
        { value: hasRole("organisation administrator"), label: "admins" },
      ]}
      points={[
        "Every idea has a primary and a backup mentor.",
        RESPONSE_EXPECTATION,
        "A programme coordinator answers general questions.",
        <Link key="operations" href="/operations/">
          How we run the programme
        </Link>,
      ]}
      note={<>Programme questions: {mail}</>}
    />
  ),
  "contributor-guide": () => (
    <HeroCard
      label="The guide at a glance"
      title="Step by step"
      stats={[
        { value: 7, label: "steps to apply" },
        { value: MENTORS_PER_IDEA, label: "mentors on every idea" },
      ]}
      facts={[
        { label: "First step", value: <Link href="/ideas/">Choose an idea</Link> },
        { label: "Submit on", value: <a href={GSOC_URL}>the official GSoC website</a> },
        { label: "Questions", value: mail },
      ]}
      cta={{ href: "/warm-up/", label: "Start the warm-up" }}
    />
  ),
  "warm-up": () => (
    <HeroCard
      label="The warm-up at a glance"
      title="At a glance"
      stats={[
        { value: PROJECTS.length, label: "codebases covered" },
        { value: 0, label: "keys needed" },
      ]}
      facts={[
        { label: "Covers", value: projectNames },
        { label: "Secret asked for?", value: "Report it as a setup issue" },
      ]}
      cta={{ href: `#${PROJECTS[0].slug}`, label: `Start with ${PROJECTS[0].name}` }}
    />
  ),
  proposal: () => (
    <HeroCard
      label="Submitting a proposal"
      title="Where and when"
      facts={[
        { label: "Submit on", value: <a href={GSOC_URL}>the official GSoC website</a> },
        { label: "When", value: "During the contributor application period" },
        { label: "Dates", value: <a href={GSOC_TIMELINE_URL}>Google&apos;s official timeline</a> },
        { label: "Draft review", value: mail },
      ]}
      cta={{ href: "#the-template", label: "Jump to the template" }}
      note="Google has not announced the 2027 dates yet."
    />
  ),
  selection: () => (
    <HeroCard
      label="Selection at a glance"
      title="At a glance"
      stats={[
        { value: 4, label: "criteria" },
        { value: PLANNED_CONTRIBUTORS, label: "contributor in 2027" },
      ]}
      facts={[
        { label: "Criteria", value: "Understanding of the problem, a prior contribution, communication, a realistic plan" },
        { label: "Process", value: "Mentors read every proposal and interview shortlisted applicants" },
      ]}
      cta={{ href: "/proposal/", label: "Proposal template" }}
    />
  ),
  "ai-policy": () => (
    <HeroCard
      label="The AI policy at a glance"
      title="In brief"
      facts={[
        { label: "Allowed", value: "Research and learning" },
        { label: "Disclose", value: "In the pull request, when an AI tool produced a meaningful part of the code" },
        { label: "Not accepted", value: "Proposals written by AI and fabricated evidence" },
      ]}
      cta={{ href: "/proposal/", label: "Write your proposal" }}
    />
  ),
  faq: () => (
    <HeroCard
      label="Still have a question?"
      title="Still have a question?"
      facts={[
        { label: "Email", value: mail },
        { label: "Replies", value: RESPONSE_EXPECTATION },
      ]}
      cta={{ href: "/contact/", label: "Contact us" }}
    />
  ),
  contact: () => (
    <HeroCard
      label="Programme email"
      title="Programme email"
      facts={[
        { label: "Email", value: <CopyEmail email={CONTACT_EMAIL} className="hero-copy-email" /> },
        { label: "Replies", value: RESPONSE_EXPECTATION },
        { label: "Defects", value: "An issue in the relevant repository" },
      ]}
      cta={{ href: "#contact-people", label: "Individual contacts" }}
    />
  ),
  operations: () => (
    <HeroCard
      label="The programme at a glance"
      title="At a glance"
      stats={[
        { value: PLANNED_CONTRIBUTORS, label: "contributor" },
        { value: MENTORS_PER_IDEA, label: "mentors: primary and backup" },
      ]}
      facts={[
        { label: "Every week", value: "A call with the primary mentor, a written exchange and a short public progress report" },
        { label: "Escalation", value: "Primary mentor, backup mentor, administrators, then Google" },
      ]}
      cta={{ href: "/mentors/", label: "Meet the mentors" }}
    />
  ),
  agenda: () => (
    <HeroCard
      label="Our agenda at a glance"
      title="At a glance"
      facts={[
        { label: "Aim", value: "One contributor who becomes the supported owner of one part of one codebase" },
        { label: "Codebases", value: PROJECTS.length },
        { label: "Payments", value: "No GSoC idea involves payments, pricing or paid features" },
      ]}
      cta={{ href: "/contributor-guide/", label: "Get involved" }}
    />
  ),
  "why-elixpo": () => (
    <HeroCard
      label="Elixpo at a glance"
      title="At a glance"
      stats={[
        { value: mentorCount, label: "mentors" },
        { value: hasRole("organisation administrator"), label: "admins" },
        { value: PLANNED_CONTRIBUTORS, label: "planned contributor" },
      ]}
      facts={[
        { label: "On GitHub since", value: "February 2024" },
        { label: "Codebases", value: `${PROJECTS.length}, under the MIT License` },
      ]}
      cta={{ href: "/about/", label: "Read the record" }}
    />
  ),
  about: () => (
    <HeroCard
      label="Elixpo's record at a glance"
      title="The record"
      stats={[{ value: 47, label: "Hacktoberfest 2025 pull requests merged" }]}
      facts={[
        { label: "Hacktoberfest", value: "2024 and 2025, maintainer-led" },
        { label: "Contributors", value: "24 GitHub accounts in October 2025" },
        { label: "Organisation", value: "On GitHub since 2024" },
      ]}
      cta={{ href: "/mentors/", label: "Meet the mentors" }}
    />
  ),
  glossary: () => (
    <HeroCard
      label="The glossary at a glance"
      title="Three groups"
      points={[
        <a key="p" href="#the-programme">The programme</a>,
        <a key="i" href="#ideas-and-proposals">Ideas and proposals</a>,
        <a key="c" href="#working-with-code">Working with code</a>,
      ]}
      cta={{ href: "/faq/", label: "Read the FAQ" }}
    />
  ),
  privacy: () => (
    <HeroCard
      label="Privacy at a glance"
      title="In brief"
      facts={[
        { label: "Cookies", value: "None" },
        { label: "Analytics", value: "None" },
        { label: "Hosting", value: "Cloudflare Pages" },
        { label: "Questions", value: mail },
      ]}
      cta={{ href: "/terms/", label: "Terms of service" }}
    />
  ),
  terms: () => (
    <HeroCard
      label="The terms at a glance"
      title="In brief"
      facts={[
        { label: "Site code", value: "MIT" },
        { label: "Site text", value: "CC BY 4.0" },
        { label: "Takes precedence", value: "Google's official rules, dates and eligibility" },
      ]}
      cta={{ href: "/privacy/", label: "Privacy notice" }}
    />
  ),
  "code-of-conduct": () => (
    <HeroCard
      label="Reporting a concern"
      title="Report a concern"
      facts={[
        { label: "Write to", value: mail },
        { label: "Subject", value: "Code of Conduct report" },
        { label: "About an admin?", value: "Write to the other administrator" },
      ]}
      cta={{ href: `mailto:${CONTACT_EMAIL}?subject=Code%20of%20Conduct%20report`, label: "Report a concern" }}
    />
  ),
  contributing: () => (
    <HeroCard
      label="Ways to contribute"
      title="Ways to contribute"
      facts={[
        { label: "Ideas", value: <>Suggest or improve one: {mail}</> },
        { label: "Codebases", value: `${PROJECTS.length}; small fixes, tests and docs welcome at any time` },
      ]}
      cta={{ href: "/projects/", label: "Browse the codebases" }}
    />
  ),
  agreements: () => (
    <HeroCard
      label="Agreements at a glance"
      title="At a glance"
      stats={[
        { value: AGREEMENT_ROWS.length, label: "commitments" },
        { value: AGREEMENT_ROWS.filter((row) => row.status === "signed").length, label: "signed so far" },
      ]}
      facts={[{ label: "Covers", value: "Time and replies, mentoring duties, evaluations, conduct, confidentiality, conflicts of interest" }]}
      cta={{ href: "/mentors/", label: "Meet the mentors" }}
    />
  ),
};

/** The hero card for a page, by content slug; null for pages without one (home, timeline). */
export function PageHeroCard({ slug }: { slug: string }) {
  const card = CARDS[slug];
  return card ? <>{card()}</> : null;
}
