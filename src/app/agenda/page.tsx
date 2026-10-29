import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("agenda");

export default function AgendaPage() {
  return <MarkdownPage slug="agenda" eyebrow="Agenda" />;
}
