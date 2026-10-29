import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("selection");

export default function SelectionPage() {
  return <MarkdownPage slug="selection" eyebrow="Applying" />;
}
