import { CONTENT_MODE } from "@/lib/content-mode";
import { publishable } from "@para/contracts";
import { getProducts } from "@/content/catalog";
import { SERVICE_FAMILIES_CONTENT } from "@/content/services";
import { NEWS } from "@/content/news";
import type { SearchEntry } from "@/components/layout/search";

/** Index de recherche du prototype (statique). Sera remplacé par la recherche de l'API. */
export function buildSearchIndex(): SearchEntry[] {
  const pages: SearchEntry[] = [
    { title: "Boutique", href: "/boutique", kind: "Page", description: "Parapharmacie, soins et beauté" },
    { title: "Soins & bien-être", href: "/soins", kind: "Page", description: "Visage, corps, massages, spa" },
    { title: "Demander un rendez-vous", href: "/soins/reservation", kind: "Page", description: "Réservation de soin" },
    { title: "Notre institut", href: "/institut", kind: "Page", description: "Galerie marchande de l'Hôtel Palm Club, Abidjan" },
    { title: "Actualités et événements", href: "/actualites", kind: "Page" },
    { title: "Contact", href: "/contact", kind: "Page", description: "WhatsApp, adresse" },
  ];
  const services: SearchEntry[] = SERVICE_FAMILIES_CONTENT.map((s) => ({ title: s.title, href: `/soins#${s.family}`, kind: "Soin", description: s.lede }));
  const products: SearchEntry[] = getProducts().map((p) => ({ title: p.name, href: `/boutique/${p.slug}`, kind: "Produit", description: p.shortDescription }));
  const news: SearchEntry[] = publishable(NEWS, CONTENT_MODE)
    .filter((n) => n.status === "VERIFIED")
    .map((n) => ({ title: n.title, href: "/actualites", kind: "Actualité", description: n.excerpt }));
  return [...pages, ...services, ...products, ...news];
}
