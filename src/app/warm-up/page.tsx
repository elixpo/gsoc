import { JsonLd } from "@/components/blocks";
import { MarkdownPage, markdownMetadata } from "@/components/MarkdownPage";
import { getPage, PROJECTS, sections } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export const metadata = markdownMetadata("warm-up");

/**
 * One HowTo per participating project, built from that project's section of
 * content/pages/warm-up.md: each line of its shell code blocks is one step.
 * The page text and the structured data therefore cannot drift apart.
 */
function howTos() {
  const bySection = new Map(sections(getPage("warm-up").body).map(({ heading, markdown }) => [heading, markdown]));
  return PROJECTS.map((project) => {
    const markdown = bySection.get(project.name);
    if (!markdown) throw new Error(`content/pages/warm-up.md: no "## ${project.name}" section`);
    const commands = [...markdown.matchAll(/```bash\n([\s\S]*?)```/g)].flatMap((block) => block[1].split("\n").filter((line) => line.trim()));
    if (!commands.length) throw new Error(`content/pages/warm-up.md: "## ${project.name}" has no bash commands`);
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `Set up ${project.name} without keys`,
      url: absoluteUrl(`/warm-up/#${project.slug}`),
      step: commands.map((command, index) => ({ "@type": "HowToStep", position: index + 1, name: command, text: command })),
    };
  });
}

export default function WarmUpPage() {
  return (
    <>
      <JsonLd data={howTos()} />
      <MarkdownPage slug="warm-up" eyebrow="Warm-up" />
    </>
  );
}
