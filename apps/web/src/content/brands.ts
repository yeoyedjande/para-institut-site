import type { Brand } from "@para/contracts";

/**
 * Marques citées dans de précédentes communications. Ni inventaire, ni confirmation de stock, ni partenariat
 * officiel : statut TO_CONFIRM, donc masquées en production tant que l'établissement ne les a pas validées.
 */
export const BRANDS: Brand[] = [
  { id: "b-bioderma", slug: "bioderma", name: "Bioderma", status: "TO_CONFIRM", note: "Citée dans de précédentes communications" },
  { id: "b-filorga", slug: "filorga", name: "Filorga", status: "TO_CONFIRM", note: "Citée dans de précédentes communications" },
  { id: "b-biocyte", slug: "biocyte", name: "Biocyte", status: "TO_CONFIRM", note: "Citée dans de précédentes communications" },
];
