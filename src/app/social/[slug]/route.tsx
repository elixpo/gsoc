/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getIdea, getPage, IDEAS } from "@/lib/content";
import { sizeLabel } from "@/components/blocks";

export const dynamic = "force-static";
export const dynamicParams = false;

const PAGE_SLUGS = ["home", "ideas", "people", "contributor-guide", "proposal", "selection", "ai-policy", "timeline", "faq", "contact"];

export function generateStaticParams() {
  return [...PAGE_SLUGS, ...IDEAS.map((idea) => idea.slug)].map((slug) => ({ slug: `${slug}.png` }));
}

function card(slug: string) {
  const idea = getIdea(slug);
  if (idea) {
    return {
      title: idea.title,
      summary: idea.summary,
      tag: `${sizeLabel(idea.sizeHours)} · ${idea.difficulty} · ${idea.theme}`,
    };
  }
  if (!PAGE_SLUGS.includes(slug)) return null;
  const page = getPage(slug);
  return {
    title: slug === "home" ? "Google Summer of Code 2027" : page.heading,
    summary: slug === "home" ? "First-time applicant · plans to mentor one contributor · six project ideas" : page.lead,
    tag: "Preparing to apply · not yet announced by Google",
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = card(slug.replace(/\.png$/, ""));
  if (!data) return new Response("Social card not found.\n", { status: 404 });
  const titleSize = data.title.length > 70 ? 54 : data.title.length > 40 ? 64 : 76;
  const summary = data.summary.length > 190 ? `${data.summary.slice(0, 187).trimEnd()}…` : data.summary;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#fbfbf8", color: "#142018", fontFamily: "Arial, sans-serif", padding: "64px 72px" }}>
        <div style={{ position: "absolute", width: 650, height: 650, borderRadius: 999, right: -200, top: -250, background: "#dce7ff" }} />
        <div style={{ position: "absolute", width: 440, height: 440, borderRadius: 999, right: 10, top: 40, border: "2px solid rgba(20,32,24,.18)" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: 999, right: 120, top: 160, background: "#f3b529" }} />
        <div style={{ position: "relative", width: 880, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="https://elixpo.com/logos/logo.png" style={{ width: 40, height: 40 }} alt="" />
            <span style={{ color: "#3a65c7", fontSize: 18, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Elixpo · GSoC 2027</span>
          </div>
          <div style={{ display: "flex", marginTop: 46, fontSize: titleSize, fontWeight: 700, lineHeight: 1, letterSpacing: -2.5 }}>{data.title}</div>
          <div style={{ display: "flex", marginTop: 26, maxWidth: 780, color: "#5f6962", fontSize: 24, lineHeight: 1.4 }}>{summary}</div>
          <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 16 }}>
            <span style={{ display: "flex", padding: "10px 16px", borderRadius: 999, background: "#142018", color: "white", fontSize: 15, letterSpacing: 1 }}>{data.tag}</span>
            <span style={{ color: "#5f6962", fontSize: 18 }}>gsoc.elixpo.com</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
