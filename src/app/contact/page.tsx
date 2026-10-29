import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";
import { PeopleTable } from "@/components/PeopleTable";
import { CONTACT_EMAIL } from "@/data/site";

export const metadata = markdownMetadata("contact");

export default function ContactPage() {
  return (
    <MarkdownPage
      slug="contact"
      eyebrow="Contact"
      extraToc={[
        { id: "contact-shared", text: "Programme email" },
        { id: "contact-people", text: "Individual contacts" },
      ]}
    >
      <section className="page-section" aria-labelledby="contact-shared">
        <h2 id="contact-shared">Programme email</h2>
        <p>For private questions, or questions about the programme itself, write to:</p>
        <p className="big-link">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
      <section className="page-section" aria-labelledby="contact-people">
        <h2 id="contact-people">Individual contacts</h2>
        <PeopleTable headingId="contact-people" />
        <p className="note">If you are not sure who to write to, use {CONTACT_EMAIL}.</p>
      </section>
    </MarkdownPage>
  );
}
