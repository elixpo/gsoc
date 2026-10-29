import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("contributor-guide");

export default function ContributorGuidePage() {
  return <MarkdownPage slug="contributor-guide" eyebrow="Contributor guide" />;
}
