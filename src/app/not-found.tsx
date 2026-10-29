import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist on the Elixpo Google Summer of Code site.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <header className="page-hero">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="lead">We could not find this page. It may have moved, or the link may be wrong. These links will help you find your way.</p>
      <div className="actions">
        <Link href="/">Go to the home page</Link>
        <Link href="/ideas/">See the project ideas</Link>
        <Link href="/faq/">Read the FAQ</Link>
      </div>
    </header>
  );
}
