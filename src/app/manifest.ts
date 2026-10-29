import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elixpo · Google Summer of Code 2027",
    short_name: "Elixpo GSoC",
    description: "Elixpo's Google Summer of Code 2027 project ideas, mentors and contributor guide.",
    start_url: "/",
    display: "browser",
    lang: "en",
    scope: "/",
    id: "/",
    background_color: "#fbfbf8",
    theme_color: "#fbfbf8",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
