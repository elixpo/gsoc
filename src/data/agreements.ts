/**
 * Mentor and administrator agreements for Google Summer of Code 2027.
 *
 * Everyone who mentors or administers for Elixpo signs a public commitment.
 * A signed copy is published at public/agreements/<github>-gsoc-2027-commitment.pdf.
 *
 * To publish a signed copy: add the PDF to public/agreements/, then set
 * `status: "signed"` and `signedOn` (an ISO date, YYYY-MM-DD) here in the same
 * commit. The build fails if a person is marked signed without the PDF, or if
 * a PDF exists for someone who is not marked signed (src/lib/agreements.ts).
 */
export type AgreementStatus = "awaiting-signature" | "signed";

export type Agreement = {
  /** GitHub handle; must match a person in src/data/people.ts. */
  github: string;
  /** The programme roles the commitment covers; each must be one of the person's roles. */
  roles: string[];
  /** Title of the signed document. */
  title: string;
  /** Public path of the signed copy. */
  document: `/agreements/${string}-gsoc-2027-commitment.pdf`;
  status: AgreementStatus;
  /** ISO date (YYYY-MM-DD) of the signature, or null while awaiting signature. */
  signedOn: string | null;
};

/** The blank template the coordinator publishes. The link is shown only once the file exists. */
export const AGREEMENT_TEMPLATE = "/agreements/elixpo-gsoc-2027-commitment-template.pdf";

export const AGREEMENTS: Agreement[] = [
  {
    github: "Circuit-Overtime",
    roles: ["Lead organisation administrator", "Mentor"],
    title: "Organisation administrator and mentor commitment, GSoC 2027",
    document: "/agreements/Circuit-Overtime-gsoc-2027-commitment.pdf",
    status: "awaiting-signature",
    signedOn: null,
  },
  {
    github: "ez-vivek",
    roles: ["Organisation administrator", "Mentor"],
    title: "Organisation administrator and mentor commitment, GSoC 2027",
    document: "/agreements/ez-vivek-gsoc-2027-commitment.pdf",
    status: "awaiting-signature",
    signedOn: null,
  },
  {
    github: "divyanshuj91",
    roles: ["Mentor"],
    title: "Mentor commitment, GSoC 2027",
    document: "/agreements/divyanshuj91-gsoc-2027-commitment.pdf",
    status: "awaiting-signature",
    signedOn: null,
  },
  {
    github: "anwe-ch",
    roles: ["Programme coordinator"],
    title: "Programme coordinator commitment, GSoC 2027",
    document: "/agreements/anwe-ch-gsoc-2027-commitment.pdf",
    status: "awaiting-signature",
    signedOn: null,
  },
];
