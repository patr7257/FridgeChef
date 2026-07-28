import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FridgeChef",
    short_name: "FridgeChef",
    description:
      "Tag et billede af dit køleskab og få tre forslag til aftensmad du kan lave nu.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1512",
    theme_color: "#1a1512",
    lang: "da",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
