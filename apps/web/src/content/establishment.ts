import type { Sourced } from "@para/contracts";

/**
 * Faits sur l'établissement. Chaque entrée renvoie à une source de docs/SOURCE_OF_TRUTH.md.
 * Ne jamais ajouter un fait sans source ; une information non validée reste TO_CONFIRM.
 */
export const ESTABLISHMENT = {
  name: { value: "Para Institut du Palm Club", status: "VERIFIED", source: "SRC-01" },
  /** Graphie du logo officiel. */
  logoName: { value: "Para-Institut Palm Club", status: "VERIFIED", source: "SRC-01" },
  activities: {
    value: ["Institut de détente et de beauté", "Parapharmacie"],
    status: "VERIFIED",
    source: "SRC-00",
  },
  address: {
    value: {
      line: "Galerie marchande de l'Hôtel Palm Club",
      city: "Abidjan",
      country: "Côte d'Ivoire",
      countryCode: "CI",
    },
    status: "VERIFIED",
    source: "SRC-04",
  },
} as const satisfies Record<string, Sourced<unknown>>;

export interface PhoneContact {
  e164: string;
  display: string;
  /** Usage du numéro : configurable (commandes, réservations, service client) — non attribué à ce stade. */
  usage: string;
  status: Sourced<string>["status"];
  source: string;
}

/** Numéros publiés sur le site événementiel et les profils publics de l'établissement. */
export const PHONES: PhoneContact[] = [
  { e164: "+2250711111828", display: "+225 07 11 11 18 28", usage: "Renseignements", status: "VERIFIED", source: "SRC-02" },
  { e164: "+2250711111831", display: "+225 07 11 11 18 31", usage: "Renseignements", status: "VERIFIED", source: "SRC-02" },
];

export function whatsappHref(e164: string, text?: string): string {
  const base = `https://wa.me/${e164.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

export interface HoursEntry {
  label: string;
  days: string;
  hours: string;
  status: Sourced<string>["status"];
  source: string;
}

/** Horaires issus d'anciennes communications : affectation aux activités non confirmée (masqués en production). */
export const HOURS: HoursEntry[] = [
  { label: "Horaire communiqué (activité à préciser)", days: "Du lundi au samedi", hours: "08h00 – 20h00", status: "TO_CONFIRM", source: "SRC-00" },
  { label: "Horaire communiqué (activité à préciser)", days: "Du mardi au samedi", hours: "09h00 – 19h00", status: "TO_CONFIRM", source: "SRC-00" },
];

export interface SocialLink {
  network: "Instagram" | "Facebook" | "TikTok";
  handle: string;
  href: string;
  status: Sourced<string>["status"];
  source: string;
}

/** Profils publics retrouvés (nom, adresse et numéros concordants) ; propriété à confirmer par l'établissement. */
export const SOCIALS: SocialLink[] = [
  { network: "Instagram", handle: "@parainstitut2plateaux", href: "https://www.instagram.com/parainstitut2plateaux/", status: "TO_CONFIRM", source: "SRC-05" },
  { network: "Facebook", handle: "ParaInstitutPalmClub", href: "https://www.facebook.com/ParaInstitutPalmClub/", status: "TO_CONFIRM", source: "SRC-05" },
  { network: "TikTok", handle: "@parainstitutpalmclub", href: "https://www.tiktok.com/@parainstitutpalmclub", status: "TO_CONFIRM", source: "SRC-05" },
];

export const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Para Institut Palm Club, Abidjan");
