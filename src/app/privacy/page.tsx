import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";

export const metadata = markdownMetadata("privacy");

export default function PrivacyPage() {
  return <MarkdownPage slug="privacy" eyebrow="Privacy" />;
}
