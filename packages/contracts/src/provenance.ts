/**
 * Traçabilité des informations publiées (voir docs/SOURCE_OF_TRUTH.md).
 *
 * - VERIFIED   : confirmée par une source primaire (dépôt officiel, site officiel, publication de l'établissement).
 * - HISTORICAL : issue d'une communication passée ; ne doit pas être présentée comme actuelle.
 * - TO_CONFIRM : plausible mais non validée par l'établissement ; masquée en production.
 * - DEMO_ONLY  : donnée de démonstration ; jamais publiée en production.
 */
export const SOURCE_STATUSES = ["VERIFIED", "HISTORICAL", "TO_CONFIRM", "DEMO_ONLY"] as const;
export type SourceStatus = (typeof SOURCE_STATUSES)[number];

/** Mode de contenu du déploiement : "demo" (prototype, recette) ou "production". */
export type ContentMode = "demo" | "production";

export interface Sourced<T> {
  value: T;
  status: SourceStatus;
  /** Référence courte de la source, détaillée dans SOURCE_OF_TRUTH.md (ex. "SRC-03"). */
  source: string;
}

/**
 * Une information est publiable en production uniquement si elle est VERIFIED.
 * En mode démo, tout est affiché mais signalé visuellement par son statut.
 */
export function isPublishable(status: SourceStatus, mode: ContentMode): boolean {
  if (mode === "production") return status === "VERIFIED";
  return true;
}

/** Filtre une liste d'éléments sourcés selon le mode de contenu. */
export function publishable<T extends { status: SourceStatus }>(items: readonly T[], mode: ContentMode): T[] {
  return items.filter((item) => isPublishable(item.status, mode));
}

export const STATUS_LABELS: Record<SourceStatus, string> = {
  VERIFIED: "Vérifié",
  HISTORICAL: "Historique",
  TO_CONFIRM: "À confirmer",
  DEMO_ONLY: "Démonstration",
};
