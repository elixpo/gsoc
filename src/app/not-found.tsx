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
      heading="Page not found"
      lead="We could not find this page. It may have moved, or the link may be wrong. These links will help you find your way."
    >
      <div className="actions">
        <Link href="/">Go to the home page</Link>
        <Link href="/ideas/">See the project ideas</Link>
        <Link href="/faq/">Read the FAQ</Link>
      </div>
    </PageHero>
  );
}
