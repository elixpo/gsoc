import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("timeline");

export default function TimelinePage() {
  return <MarkdownPage slug="timeline" eyebrow="Timeline" />;
}
