import type { Metadata, Viewport } from "next";
import { Bitcount_Grid_Double, Cormorant_Garamond, Pathway_Gothic_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import {
  CODE_OF_CONDUCT_URL,
  CONTACT_EMAIL,
  DISCUSSIONS_NOTE,
  DISCUSSIONS_URL,
  GITHUB_ORG_URL,
  GSOC_TRADEMARK_NOTICE,
  GSOC_URL,
  LEGAL_PAGES,
  SITE_LAUNCHED,
  SITE_MAP,
  SITE_NAME,
  SITE_URL,
  STATUS_BANNER,
} from "@/data/site";
import { CopyEmail } from "@/components/CopyEmail";
import { MainNav } from "@/components/MainNav";
import { JsonLd } from "@/components/blocks";
import { organizationJsonLd, socialCard, websiteJsonLd } from "@/lib/seo";

const description =
  "Elixpo is applying to be a mentoring organisation for Google Summer of Code 2027. Project ideas, participating projects, mentors, the contributor guide and selection criteria.";

/*
 * Type follows me.elixpo: Pathway Gothic One for tall condensed display caps
 * (me.elixpo's display fallback; its primary face, Canopee, is a commercial
 * font and is not redistributed), Cormorant Garamond italic for accents and
 * Bitcount Grid Double for mono eyebrows, all under the SIL Open Font Licence
 * (LICENSES/fonts/). next/font downloads them at build time and serves them
 * from this site, so visitors' browsers never contact a font service.
 */
const mono = Bitcount_Grid_Double({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-bitcount",
  display: "swap",
  // next/font has no metric overrides for this face, so it cannot generate an adjusted fallback.
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const gothic = Pathway_Gothic_One({ subsets: ["latin"], weight: "400", variable: "--font-pathway", display: "swap" });

const homeCard = socialCard("home");
/** Optional Google Search Console verification token, only emitted when set at build time. */
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const viewport: Viewport = { themeColor: "#f6f5f0", colorScheme: "light" };

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
  // Icons use the Elixpo mark only, never the GSoC logo.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
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
    images: [{ url: homeCard.url, width: homeCard.width, height: homeCard.height, alt: "Elixpo, Google Summer of Code 2027", type: "image/png" }],
  },
  twitter: { card: "summary_large_image", title: "Elixpo · Google Summer of Code 2027", description, images: [{ url: homeCard.url, alt: "Elixpo, Google Summer of Code 2027" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${serif.variable} ${gothic.variable}`}>
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
            <Image src="/icon-192.png" width="38" height="38" alt="" priority unoptimized />
            <span>
              <b>Elixpo</b>
              <small>GSoC 2027</small>
            </span>
          </Link>
          <MainNav />
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-top">
            <div>
              <p className="eyebrow">Elixpo · Google Summer of Code 2027</p>
              <p className="footer-display">
                Ask early. <em>Build in public.</em>
              </p>
            </div>
            <div className="footer-contact">
              <p className="footer-contact-label">Programme email</p>
              <CopyEmail email={CONTACT_EMAIL} className="footer-email" />
              <p className="footer-contact-note">{DISCUSSIONS_NOTE}</p>
            </div>
          </div>
          <div className="footer-grid">
            <div className="footer-brand">
              <Image src="/icon-192.png" width="44" height="44" alt="" unoptimized />
              <div>
                <strong>Elixpo · Google Summer of Code 2027</strong>
                <p>
                  Questions about the programme or an idea: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Defects and setup
                  problems: an issue in the relevant repository.
                </p>
              </div>
            </div>
            <nav aria-labelledby="footer-sitemap" className="footer-sitemap">
              <h2 id="footer-sitemap">Site map</h2>
              <ul>
                {SITE_MAP.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="footer-elsewhere" className="footer-elsewhere">
              <h2 id="footer-elsewhere">Elixpo elsewhere</h2>
              <ul>
                <li>
                  <a href={GITHUB_ORG_URL}>Elixpo on GitHub</a>
                </li>
                <li>
                  <a href={DISCUSSIONS_URL}>GitHub Discussions (opens with the 2027 dates)</a>
                </li>
                <li>
                  <a href={CODE_OF_CONDUCT_URL}>Elixpo Code of Conduct (full text)</a>
                </li>
                <li>
                  <a href={GSOC_URL}>Official Google Summer of Code site</a>
                </li>
              </ul>
            </nav>
          </div>
          <nav aria-labelledby="footer-legal-heading" className="footer-legal-nav">
            <h2 id="footer-legal-heading">Legal and community</h2>
            <ul>
              {LEGAL_PAGES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-legal">
            <p>
              Site code is MIT licensed; site text is available under{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Each Elixpo project keeps its own licence; see its repository.
            </p>
            <p className="trademark">{GSOC_TRADEMARK_NOTICE}</p>
          </div>
        </footer>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      </body>
    </html>
  );
}
