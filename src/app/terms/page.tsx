import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("terms");

export default function TermsPage() {
  return <MarkdownPage slug="terms" eyebrow="Terms" />;
}
