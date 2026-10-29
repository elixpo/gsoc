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
};

export const PEOPLE: Person[] = [
  {
    name: "Vivek Yadav", // TODO confirm
    github: "ez-vivek",
    roles: ["Organisation administrator", "Mentor", "Programme point of contact"], // TODO confirm
    isMentor: true,
    isPointOfContact: true,
    email: "vivek@elixpo.com",
    about: "Elixpo contributor, including LixBlogs. Organisation administrator for the GSoC application.",
  },
  {
    name: "Ayushman Bhattacharya", // TODO confirm
    github: "Circuit-Overtime",
    roles: ["Mentor", "Founder of Elixpo"], // TODO confirm
    isMentor: true,
    isPointOfContact: false,
    email: "ayushman@elixpo.com",
    about: "Founded Elixpo and maintains several of its projects.",
  },
  {
    name: "Divyanshu", // TODO confirm full name and spelling
    github: "divyanshuj91",
    roles: ["Mentor"], // TODO confirm
    isMentor: true,
    isPointOfContact: false,
    email: "divyanshu.elixpo@gmail.com",
    about: "Elixpo contributor across several projects, including LixBlogs, LixSketch and Elixpo Open Source.",
  },
  {
    name: "Anwesha Chakraborty", // TODO confirm
    github: "anwe-ch",
    roles: ["Programme coordinator", "Programme point of contact"], // TODO confirm
    isMentor: false,
    isPointOfContact: true,
    email: "anwesha@elixpo.com",
    about: "Coordinates community questions for the programme. Not a mentor.",
  },
];

export const MENTORS = PEOPLE.filter((person) => person.isMentor);

export function getPerson(github: string): Person {
  const person = PEOPLE.find((entry) => entry.github === github);
  if (!person) throw new Error(`Unknown person "${github}". Add them to src/data/people.ts.`);
  return person;
}
