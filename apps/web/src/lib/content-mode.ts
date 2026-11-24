import type { ContentMode } from "@para/contracts";

/**
 * Mode de contenu du déploiement. Par défaut « demo » : le prototype n'est jamais présenté comme le site
 * de production. En « production », seules les informations VERIFIED sont publiées et les données de
 * démonstration disparaissent (voir docs/SOURCE_OF_TRUTH.md).
 */
export const CONTENT_MODE: ContentMode =
  process.env.NEXT_PUBLIC_CONTENT_MODE === "production" ? "production" : "demo";

export const IS_DEMO = CONTENT_MODE === "demo";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
