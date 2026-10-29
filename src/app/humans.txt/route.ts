import { PEOPLE } from "@/data/people";
import { CONTACT_EMAIL, CONTENT_REVIEWED, ELIXPO_URL } from "@/data/site";

export const dynamic = "force-static";

/** humans.txt, built from src/data/people.ts so names and roles live in one place. */
export function GET() {
  const team = PEOPLE.map((person) => `${person.roles.join(", ")}: ${person.name}\nGitHub: @${person.github}`).join("\n\n");
  const body = `/* TEAM */
${team}

Contact: ${CONTACT_EMAIL}
From: Elixpo, ${ELIXPO_URL}

/* SITE */
Last update: ${CONTENT_REVIEWED}
Language: English
Components: Next.js (static export), React, TypeScript, marked
Content: Markdown, CC BY 4.0
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
