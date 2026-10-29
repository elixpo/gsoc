import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("ai-policy");

export default function AiPolicyPage() {
  return <MarkdownPage slug="ai-policy" eyebrow="Policy" />;
}
