import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("contributing");

export default function ContributingPage() {
  return <MarkdownPage slug="contributing" eyebrow="Community" />;
}
