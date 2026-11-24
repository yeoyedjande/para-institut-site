import { z } from "zod";
import { SOURCE_STATUSES } from "./provenance";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide");
const status = z.enum(SOURCE_STATUSES);

export const BrandSchema = z.object({
  id: z.string(),
  slug,
  name: z.string().min(1),
  status,
  note: z.string().optional(),
});
export type Brand = z.infer<typeof BrandSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  slug,
  name: z.string().min(1),
  description: z.string().optional(),
  status,
});
export type Category = z.infer<typeof CategorySchema>;

export const AVAILABILITY = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "ON_REQUEST"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export const ProductSchema = z.object({
  id: z.string(),
  slug,
  name: z.string().min(1),
  brandId: z.string().nullable(),
  categoryId: z.string(),
  /** Prix unitaire TTC en FCFA ; null = non communiqué. */
  priceXof: z.number().int().nonnegative().nullable(),
  availability: z.enum(AVAILABILITY),
  shortDescription: z.string(),
  description: z.string().optional(),
  /** Familles de texture, servant à la direction artistique (pas une allégation produit). */
  texture: z.enum(["serum", "creme", "gel", "huile", "baume", "brume"]),
  volume: z.string().optional(),
  status,
});
export type Product = z.infer<typeof ProductSchema>;

export const SERVICE_FAMILIES = ["visage", "corps", "massages", "spa"] as const;
export type ServiceFamily = (typeof SERVICE_FAMILIES)[number];

export const ServiceSchema = z.object({
  id: z.string(),
  slug,
  family: z.enum(SERVICE_FAMILIES),
  name: z.string().min(1),
  summary: z.string(),
  /** Durée en minutes ; null tant que non communiquée par l'institut. */
  durationMinutes: z.number().int().positive().nullable(),
  priceXof: z.number().int().nonnegative().nullable(),
  status,
});
export type Service = z.infer<typeof ServiceSchema>;

export const NEWS_KINDS = ["evenement", "promotion", "conseil", "nouveaute", "animation"] as const;

export const NewsItemSchema = z.object({
  id: z.string(),
  slug,
  kind: z.enum(NEWS_KINDS),
  title: z.string(),
  excerpt: z.string(),
  /** Dates ISO ; un contenu dont `endsAt` est passé n'est plus présenté comme actuel. */
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }).nullable(),
  href: z.string().optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  status,
});
export type NewsItem = z.infer<typeof NewsItemSchema>;

/** Un contenu est « actuel » s'il a commencé (ou est annoncé) et n'est pas terminé. */
export function isCurrent(item: Pick<NewsItem, "endsAt">, now: Date): boolean {
  return item.endsAt === null || new Date(item.endsAt).getTime() >= now.getTime();
}
