import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Para Institut du Palm Club",
    short_name: "Para Institut",
    description: "Institut de beauté et parapharmacie — Galerie marchande de l'Hôtel Palm Club, Abidjan",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#009a96",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
