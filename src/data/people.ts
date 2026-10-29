/**
 * Everyone named on the site, in one place.
 *
 * TODO confirm: names, roles and spellings below are pending written
 * confirmation from each person before launch. Individual emails are `null`
 * until each person confirms an address; the site then shows
 * "email coming soon". The shared programme address lives in src/data/site.ts.
 */
export type Person = {
  /** Display name. */
  name: string;
  /** GitHub handle, also used as the stable id. */
  github: string;
  /** Public roles for this programme, most important first. */
  roles: string[];
  /** Mentors may be named as primary or backup mentor on an idea. */
  isMentor: boolean;
  /** A programme point of contact. */
  isPointOfContact: boolean;
  /** Individual email, or null if not confirmed yet. */
  email: string | null;
  /** One or two plain sentences; public facts only. */
  about: string;
  /** Role at Elixpo, as published in elixpo/content/people.json; null if not listed there. */
  elixpoRole: string | null;
  /**
   * Two to four sentences for the mentors page. Verified facts only: from
   * elixpo/content/people.json (lastVerified 2026-10-16), the person's public
   * GitHub record, and the programme roles above.
   */
  bio: string;
  /** Personal portfolio page; linked only after it has been checked to return HTTP 200. */
  portfolio: string | null;
};

export const PEOPLE: Person[] = [
  {
    name: "Vivek Yadav", // TODO confirm
    github: "ez-vivek",
    roles: ["Organisation administrator", "Mentor", "Programme point of contact"], // TODO confirm
    isMentor: true,
    isPointOfContact: true,
    email: "vivek@elixpo.com",
    about: "Elixpo contributor, including LixBlogs. Organisation administrator and point of contact for the programme.",
    elixpoRole: "Lead developer",
    bio: "Lead developer at Elixpo. Works across Chapter engineering and project delivery, helping move shared implementation work into reviewed public releases. For Google Summer of Code, an organisation administrator, a mentor and a programme point of contact.",
    portfolio: "https://me.elixpo.com/vivek",
  },
  {
    name: "Ayushman Bhattacharya", // TODO confirm
    github: "Circuit-Overtime",
    roles: ["Lead organisation administrator", "Mentor", "Founder of Elixpo"], // TODO confirm
    isMentor: true,
    isPointOfContact: false,
    email: "ayushman@elixpo.com",
    about: "Founded Elixpo, leads its Google Summer of Code application and maintains several of its projects.",
    elixpoRole: "Founder, project lead and maintainer",
    bio: "Founder, project lead and maintainer of Elixpo. Coordinates Elixpo's technical direction, public releases, research surfaces, organisation operations and the shared project-foundry programme. Mentor in GirlScript Summer of Code 2025, Open Source Contribution Initiative (OSCI) 2025 and ESSOC 2026. For Google Summer of Code, the lead organisation administrator and a mentor.",
    portfolio: "https://me.elixpo.com/ayushman",
  },
  {
    name: "Divyanshu", // TODO confirm full name and spelling
    github: "divyanshuj91",
    roles: ["Mentor"], // TODO confirm
    isMentor: true,
    isPointOfContact: false,
    email: "divyanshu.elixpo@gmail.com",
    about: "Elixpo contributor across several projects, including LixBlogs, LixSketch and Elixpo Open Source.",
    elixpoRole: null,
    bio: "Contributor to LixBlogs, LixSketch, Elixpo Mails, Elixpo Accounts and Elixpo Payouts, with merged pull requests across them. Reviews other contributors' pull requests. For Google Summer of Code, a mentor.",
    portfolio: "https://me.elixpo.com/divyanshu",
  },
  {
    name: "Anwesha Chakraborty", // TODO confirm
    github: "anwe-ch",
    roles: ["Programme coordinator", "Programme point of contact"], // TODO confirm
    isMentor: false,
    isPointOfContact: true,
    email: "anwesha@elixpo.com",
    about: "Coordinates community questions for the programme. Not a mentor.",
    elixpoRole: "Research and engineering lead",
    bio: "Research and engineering lead at Elixpo. Connects open research with implementation through published studies, technical review, project development and organisation-level stewardship. For Google Summer of Code, the programme coordinator: answers programme questions sent to gsoc@elixpo.com, keeps the contributor guide, FAQ and timeline accurate, organises applicant Q&As and onboarding sessions, and keeps the public weekly progress log. Does not mentor or review code.",
    portfolio: "https://me.elixpo.com/anwesha",
  },
];

export const MENTORS = PEOPLE.filter((person) => person.isMentor);

export function getPerson(github: string): Person {
  const person = PEOPLE.find((entry) => entry.github === github);
  if (!person) throw new Error(`Unknown person "${github}". Add them to src/data/people.ts.`);
  return person;
}
