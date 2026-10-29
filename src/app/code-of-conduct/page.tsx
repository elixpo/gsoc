import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("code-of-conduct");

export default function CodeOfConductPage() {
  return <MarkdownPage slug="code-of-conduct" eyebrow="Community" />;
}
