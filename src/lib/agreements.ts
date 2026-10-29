import fs from "node:fs";
import path from "node:path";
import { AGREEMENT_TEMPLATE, AGREEMENTS, type Agreement } from "@/data/agreements";
import { getPerson, PEOPLE, type Person } from "@/data/people";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const publicFile = (route: string) => path.join(PUBLIC_DIR, route.replace(/^\//, ""));

export type AgreementRow = Agreement & { person: Person };

/**
 * Agreements joined with people, checked at build time. The build fails when
 * the published PDFs and src/data/agreements.ts disagree, so the page can never
 * link a missing copy or hide a published one.
 */
function load(): AgreementRow[] {
  const problems: string[] = [];
  const handles = new Set(AGREEMENTS.map((agreement) => agreement.github));
  for (const person of PEOPLE) {
    if (!handles.has(person.github)) problems.push(`${person.name} (${person.github}) has no entry in src/data/agreements.ts`);
  }
  if (handles.size !== AGREEMENTS.length) problems.push("src/data/agreements.ts lists someone twice");

  const rows = AGREEMENTS.map((agreement) => {
    const person = getPerson(agreement.github);
    const expected = `/agreements/${agreement.github}-gsoc-2027-commitment.pdf`;
    if (agreement.document !== expected) problems.push(`${agreement.github}: document must be ${expected}`);
    for (const role of agreement.roles) {
      if (!person.roles.includes(role)) problems.push(`${agreement.github}: role "${role}" is not one of their roles in src/data/people.ts`);
    }
    const exists = fs.existsSync(publicFile(agreement.document));
    if (agreement.status === "signed") {
      if (!exists) problems.push(`${agreement.github} is marked signed but public${agreement.document} does not exist`);
      if (!agreement.signedOn || !/^\d{4}-\d{2}-\d{2}$/.test(agreement.signedOn)) problems.push(`${agreement.github} is marked signed without a signedOn date (YYYY-MM-DD)`);
    } else {
      if (exists) problems.push(`public${agreement.document} exists but ${agreement.github} is not marked signed`);
      if (agreement.signedOn) problems.push(`${agreement.github}: signedOn must be null while awaiting signature`);
    }
    return { ...agreement, person };
  });

  const known = new Set([...AGREEMENTS.map((agreement) => path.basename(agreement.document)), path.basename(AGREEMENT_TEMPLATE)]);
  const directory = publicFile("/agreements/");
  for (const name of fs.existsSync(directory) ? fs.readdirSync(directory) : []) {
    if (name.toLowerCase().endsWith(".pdf") && !known.has(name)) problems.push(`public/agreements/${name} does not belong to anyone in src/data/agreements.ts`);
  }

  if (problems.length) throw new Error(`Agreements are inconsistent:\n- ${problems.join("\n- ")}`);
  return rows;
}

export const AGREEMENT_ROWS = load();

/** The blank template, only once the coordinator has added the file. */
export const AGREEMENT_TEMPLATE_URL = fs.existsSync(publicFile(AGREEMENT_TEMPLATE)) ? AGREEMENT_TEMPLATE : null;

/** "2026-10-29" -> "29 October 2026". */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
