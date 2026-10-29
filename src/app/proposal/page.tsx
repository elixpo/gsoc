import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("proposal");

export default function ProposalPage() {
  return <MarkdownPage slug="proposal" eyebrow="Applying" />;
}
