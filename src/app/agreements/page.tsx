import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";
import { RoleChips } from "@/components/blocks";
import { AGREEMENT_ROWS, AGREEMENT_TEMPLATE_URL, formatDate } from "@/lib/agreements";

export const metadata = markdownMetadata("agreements");

export default function AgreementsPage() {
  return (
    <MarkdownPage slug="agreements" eyebrow="Agreements" extraToc={[{ id: "signed-agreements", text: "Signed agreements" }]}>
      <section className="page-section" aria-labelledby="signed-agreements">
        <h2 id="signed-agreements">Signed agreements</h2>
        <ol className="hairline-grid agreement-grid">
          {AGREEMENT_ROWS.map((row, index) => (
            <li key={row.github} data-github={row.github} data-status={row.status}>
              <article aria-labelledby={`agreement-${row.github}`}>
                <p className="cell-number">{String(index + 1).padStart(2, "0")}</p>
                <h3 id={`agreement-${row.github}`}>{row.person.name}</h3>
                <RoleChips roles={row.roles} label={`Roles of ${row.person.name}`} />
                <dl className="agreement-facts">
                  <div>
                    <dt>Agreement</dt>
                    <dd>{row.title}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd className="agreement-status">{row.status === "signed" ? "Signed" : "Awaiting signature"}</dd>
                  </div>
                  <div>
                    <dt>Signed on</dt>
                    <dd>{row.signedOn ? <time dateTime={row.signedOn}>{formatDate(row.signedOn)}</time> : "Not yet signed"}</dd>
                  </div>
                </dl>
                {row.status === "signed" && (
                  <p className="agreement-link">
                    <a href={row.document}>
                      View signed copy (PDF)<span className="visually-hidden">: {row.person.name}</span>
                    </a>
                  </p>
                )}
              </article>
            </li>
          ))}
        </ol>
        <p className="note">Published copies are signed electronically (typed name, GitHub account and date). Personal contact details are not included.</p>
        {AGREEMENT_TEMPLATE_URL && (
          <p className="note">
            <a href={AGREEMENT_TEMPLATE_URL}>Read the blank commitment template (PDF)</a>
          </p>
        )}
      </section>
    </MarkdownPage>
  );
}
