import type { Category, Product } from "@para/contracts";
import { publishable } from "@para/contracts";
import { CONTENT_MODE } from "@/lib/content-mode";
import { BRANDS } from "./brands";

/**
 * Catalogue. En V1, il sera saisi manuellement dans le back-office. Les éléments ci-dessous sont des
 * DONNÉES DE DÉMONSTRATION (DEMO_ONLY) : noms génériques, prix fictifs, aucune marque associée. Ils
 * servent uniquement à concevoir les gabarits et disparaissent en production.
 */
export const CATEGORIES: Category[] = [
  { id: "c-visage", slug: "visage", name: "Visage", description: "Nettoyer, hydrater, protéger.", status: "DEMO_ONLY" },
  { id: "c-corps", slug: "corps", name: "Corps", description: "Le confort de la peau au quotidien.", status: "DEMO_ONLY" },
  { id: "c-solaire", slug: "solaire", name: "Protection solaire", description: "Les gestes du quotidien sous le soleil.", status: "DEMO_ONLY" },
  { id: "c-hygiene", slug: "hygiene", name: "Hygiène & douceur", description: "Les essentiels de la salle de bain.", status: "DEMO_ONLY" },
];

const demo = (p: Omit<Product, "status" | "brandId">): Product => ({ ...p, brandId: null, status: "DEMO_ONLY" });

export const PRODUCTS: Product[] = [
  demo({ id: "p1", slug: "serum-hydratant-demo", name: "Sérum hydratant", categoryId: "c-visage", priceXof: 18500, availability: "IN_STOCK", texture: "serum", volume: "30 ml", shortDescription: "Texture fluide, à appliquer matin et soir sur peau propre.", description: "Fiche de démonstration : la description, la composition et les conseils d'utilisation seront saisis depuis le back-office à partir des informations fournies par la marque." }),
  demo({ id: "p2", slug: "creme-riche-corps-demo", name: "Crème riche corps", categoryId: "c-corps", priceXof: 14000, availability: "LOW_STOCK", texture: "creme", volume: "200 ml", shortDescription: "Texture onctueuse pour les peaux qui tiraillent." }),
  demo({ id: "p3", slug: "gel-nettoyant-demo", name: "Gel nettoyant douceur", categoryId: "c-hygiene", priceXof: 9500, availability: "IN_STOCK", texture: "gel", volume: "200 ml", shortDescription: "Gel aqueux qui mousse légèrement, rincé à l'eau tiède." }),
  demo({ id: "p4", slug: "huile-seche-demo", name: "Huile sèche nourrissante", categoryId: "c-corps", priceXof: 21000, availability: "ON_REQUEST", texture: "huile", volume: "100 ml", shortDescription: "Fini satiné, pour le corps et les cheveux." }),
  demo({ id: "p5", slug: "fluide-solaire-demo", name: "Fluide protecteur", categoryId: "c-solaire", priceXof: 16500, availability: "IN_STOCK", texture: "gel", volume: "50 ml", shortDescription: "Fluide léger à renouveler au cours de la journée." }),
  demo({ id: "p6", slug: "baume-levres-demo", name: "Baume lèvres", categoryId: "c-visage", priceXof: 5500, availability: "OUT_OF_STOCK", texture: "baume", volume: "15 ml", shortDescription: "Baume fondant pour les lèvres sèches." }),
  demo({ id: "p7", slug: "creme-visage-demo", name: "Crème confort visage", categoryId: "c-visage", priceXof: 19500, availability: "IN_STOCK", texture: "creme", volume: "40 ml", shortDescription: "Crème au toucher velouté pour le visage." }),
  demo({ id: "p8", slug: "brume-fraiche-demo", name: "Brume fraîche", categoryId: "c-hygiene", priceXof: 8000, availability: "IN_STOCK", texture: "brume", volume: "150 ml", shortDescription: "Brume légère à vaporiser à distance du visage." }),
];

export function getCategories(): Category[] {
  return publishable(CATEGORIES, CONTENT_MODE);
}

export function getProducts(): Product[] {
  return publishable(PRODUCTS, CONTENT_MODE);
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getBrands() {
  return publishable(BRANDS, CONTENT_MODE);
}

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? "";
}

export const AVAILABILITY_LABELS: Record<Product["availability"], string> = {
  IN_STOCK: "Disponible",
  LOW_STOCK: "Stock limité",
  OUT_OF_STOCK: "Épuisé",
  ON_REQUEST: "Sur commande",
};
