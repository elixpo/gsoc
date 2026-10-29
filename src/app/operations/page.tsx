import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("operations");

// TODO: once github.com/elixpo/gsoc is public, link the full repository docs in
// operations/ (communication, mentor handbook, evaluation, escalation, retention,
// weekly report template) from content/pages/operations.md.
export default function OperationsPage() {
  return <MarkdownPage slug="operations" eyebrow="Programme" />;
}
