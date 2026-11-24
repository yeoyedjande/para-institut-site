import type { Service, ServiceFamily } from "@para/contracts";

export interface ServiceFamilyContent {
  family: ServiceFamily;
  index: string;
  title: string;
  /** Texte éditorial générique : aucun protocole, aucune durée, aucun tarif, aucun résultat promis. */
  lede: string;
  texture: "serum" | "creme" | "gel" | "huile";
  status: Service["status"];
  source: string;
}

/** Familles de prestations identifiées dans les communications de l'établissement (brief du commanditaire). */
export const SERVICE_FAMILIES_CONTENT: ServiceFamilyContent[] = [
  {
    family: "visage",
    index: "01",
    title: "Soins du visage",
    lede: "Un moment consacré à votre peau, précédé d'un échange sur vos habitudes et vos attentes.",
    texture: "serum",
    status: "VERIFIED",
    source: "SRC-00",
  },
  {
    family: "corps",
    index: "02",
    title: "Soins du corps",
    lede: "Des soins pensés pour le confort de la peau, de la tête aux pieds.",
    texture: "creme",
    status: "VERIFIED",
    source: "SRC-00",
  },
  {
    family: "massages",
    index: "03",
    title: "Massages",
    lede: "Une parenthèse de détente, au rythme qui vous convient.",
    texture: "huile",
    status: "VERIFIED",
    source: "SRC-00",
  },
  {
    family: "spa",
    index: "04",
    title: "Spa",
    lede: "Un espace de bien-être pour relâcher les tensions et prendre du temps pour soi.",
    texture: "gel",
    status: "VERIFIED",
    source: "SRC-00",
  },
];

/**
 * Prestations détaillées : administrables depuis le back-office. Aucune n'est publiée tant que l'institut
 * n'a pas communiqué intitulés, durées et tarifs (docs/MISSING_INFORMATION.md).
 */
export const SERVICES: Service[] = [];
