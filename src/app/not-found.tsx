import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist on the Elixpo Google Summer of Code site.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      headingHtml="Page <em>not found</em>"
      lead="The requested page does not exist. It may have moved, or the link may be incorrect. Use the links below or the site map at the foot of the page."
    >
      <div className="actions">
        <Link href="/">Home page</Link>
        <Link href="/ideas/">Project ideas</Link>
        <Link href="/faq/">FAQ</Link>
      </div>
    </PageHero>
  );
}
