import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("glossary");

export default function GlossaryPage() {
  return <MarkdownPage slug="glossary" eyebrow="Glossary" />;
}
