import { CtaBlock } from "@/components/blocks";
import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("timeline");

/**
 * The timeline only: GSoC 2027 is not announced, so the page lists the usual
 * stages without dates, links Google's official timeline and ends with a call
 * to action. No TL;DR and no hero card (see TLDR_EXEMPT in src/lib/content.ts).
 */
export default function TimelinePage() {
  return (
    <MarkdownPage slug="timeline" eyebrow="Timeline · coming soon">
      <CtaBlock
        id="prepare-now"
        title="Prepare now"
        text="You do not have to wait for the dates. Choose an idea and set up its codebase without keys."
        links={[
          { href: "/ideas/", label: "Browse the ideas" },
          { href: "/warm-up/", label: "Start the warm-up" },
        ]}
      />
    </MarkdownPage>
  );
}
