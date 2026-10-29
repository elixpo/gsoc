import { CopyEmail } from "@/components/CopyEmail";
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
        <p>For questions about the programme or a project idea, and for private matters, write to:</p>
        <p className="big-link">
          <CopyEmail email={CONTACT_EMAIL} />
        </p>
      </section>
      <section className="page-section" aria-labelledby="contact-people">
        <h2 id="contact-people">Individual contacts</h2>
        <PeopleTable headingId="contact-people" />
        <p className="note">If you are unsure whom to contact, use {CONTACT_EMAIL}.</p>
      </section>
    </MarkdownPage>
  );
}
