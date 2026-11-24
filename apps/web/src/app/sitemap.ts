import type { MetadataRoute } from "next";
import { getProducts } from "@/content/catalog";
import { SITE_URL } from "@/lib/content-mode";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/boutique", "/soins", "/soins/reservation", "/institut", "/actualites", "/contact", "/mentions-legales", "/confidentialite"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...getProducts().map((p) => ({ url: `${SITE_URL}/boutique/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
