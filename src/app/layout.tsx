import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import {
  CODE_OF_CONDUCT_URL,
  CONTACT_EMAIL,
  DISCUSSIONS_URL,
  GITHUB_ORG_URL,
  GSOC_URL,
  NAV,
  SITE_LAUNCHED,
  SITE_NAME,
  SITE_URL,
  STATUS_BANNER,
} from "@/data/site";
import { jsonLd, organizationJsonLd, socialImage } from "@/lib/seo";

const description =
  "Elixpo is preparing to apply to Google Summer of Code 2027 as a first-time mentoring organisation. Project ideas, mentors, contributor guide and selection criteria.";

export const viewport: Viewport = { themeColor: "#fbfbf8", colorScheme: "light" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Elixpo · Google Summer of Code 2027", template: `%s · ${SITE_NAME}` },
  description,
  applicationName: SITE_NAME,
  creator: "Elixpo",
  publisher: "Elixpo",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/elixpo-logo.png", type: "image/png", sizes: "1024x1024" }],
    apple: [{ url: "/elixpo-logo.png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  // Launch gate: see README. Without NEXT_PUBLIC_SITE_LAUNCHED=true every page is noindex, nofollow.
  robots: SITE_LAUNCHED
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    title: "Elixpo · Google Summer of Code 2027",
    description,
    url: "/",
    images: [{ url: socialImage("home"), width: 1200, height: 630, alt: "Elixpo, Google Summer of Code 2027" }],
  },
  twitter: { card: "summary_large_image", title: "Elixpo · Google Summer of Code 2027", description, images: [socialImage("home")] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <div className="status-banner" role="region" aria-label="Programme status">
          <p>
            <strong>Status:</strong> {STATUS_BANNER}
          </p>
        </div>
        <header className="site-header">
          <Link className="brand" href="/">
            <Image src="/favicon.ico" width="34" height="34" alt="" priority unoptimized />
            <span>
              <b>Elixpo</b>
              <small>GSoC 2027</small>
            </span>
          </Link>
          <nav aria-label="Main">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-brand">
            <Image src="/favicon.ico" width="42" height="42" alt="" unoptimized />
            <div>
              <strong>Elixpo · Google Summer of Code 2027</strong>
              <p>
                Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul>
              <li>
                <a href={GITHUB_ORG_URL}>GitHub organisation</a>
              </li>
              <li>
                <a href={DISCUSSIONS_URL}>GitHub Discussions</a>
              </li>
              <li>
                <a href={CODE_OF_CONDUCT_URL}>Code of Conduct</a>
              </li>
              <li>
                <Link href="/ai-policy/">AI policy</Link>
              </li>
              <li>
                <Link href="/timeline/">Timeline</Link>
              </li>
            </ul>
          </nav>
          <div className="footer-legal">
            <p>
              Site code is MIT licensed; site text is available under{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Each Elixpo project keeps its own licence; see its repository.
            </p>
            <p>
              Not affiliated with or endorsed by Google. <a href={GSOC_URL}>Google Summer of Code</a> is a Google programme.
            </p>
          </div>
        </footer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }} />
      </body>
    </html>
  );
}
