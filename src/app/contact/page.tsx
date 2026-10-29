import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";
import { PeopleTable } from "@/components/PeopleTable";
import { CONTACT_EMAIL } from "@/data/site";

export const metadata = markdownMetadata("contact");

export default function ContactPage() {
  return (
    <MarkdownPage slug="contact" eyebrow="Contact">
      <section className="content" aria-labelledby="contact-shared">
        <h2 id="contact-shared">Programme email</h2>
        <p className="big-link">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
      <section className="content" aria-labelledby="contact-people">
        <h2 id="contact-people">People</h2>
        <PeopleTable headingId="contact-people" />
        <p className="note">Until individual addresses are confirmed, please use {CONTACT_EMAIL}.</p>
      </section>
    </MarkdownPage>
  );
}
