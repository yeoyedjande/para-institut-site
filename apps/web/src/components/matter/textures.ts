/**
 * Familles de textures cosmétiques représentées par la scène « matière ». Il s'agit d'une représentation
 * abstraite de la lumière et des textures — jamais d'un produit réel ni d'une gamme Para Institut.
 */
export type TextureKey = "perle" | "serum" | "creme" | "gel" | "huile";

export interface MaterialParams {
  /** Couleur de corps (sRGB hex). */
  base: string;
  /** Couleur des reflets rasants. */
  rim: string;
  /** Couleur de l'arrière-plan perçu à travers la matière (transparence simulée). */
  deep: string;
  /** 0 = opaque et laiteux, 1 = très transparent. */
  clarity: number;
  /** Brillance spéculaire. */
  gloss: number;
  /** Irisation en couches minces. */
  iridescence: number;
  /** Amplitude, fréquence et vitesse de la déformation organique. */
  amp: number;
  freq: number;
  speed: number;
  /** Stries fines (aspect fouetté d'une crème). */
  ridges: number;
}

export const MATERIALS: Record<TextureKey, MaterialParams> = {
  perle: { base: "#c9d8d5", rim: "#ffffff", deep: "#2f7d79", clarity: 0.18, gloss: 1.0, iridescence: 0.55, amp: 0.13, freq: 0.75, speed: 0.2, ridges: 0 },
  serum: { base: "#11a8a3", rim: "#d9fffc", deep: "#00302e", clarity: 0.85, gloss: 1.1, iridescence: 0.25, amp: 0.14, freq: 0.85, speed: 0.24, ridges: 0 },
  creme: { base: "#efe6d8", rim: "#ffffff", deep: "#b49d80", clarity: 0.0, gloss: 0.35, iridescence: 0.05, amp: 0.09, freq: 0.7, speed: 0.13, ridges: 1 },
  gel: { base: "#a9e3de", rim: "#ffffff", deep: "#0b4e4b", clarity: 0.92, gloss: 1.2, iridescence: 0.18, amp: 0.14, freq: 0.9, speed: 0.36, ridges: 0 },
  huile: { base: "#c98a2b", rim: "#ffe2a3", deep: "#2e1703", clarity: 0.8, gloss: 1.15, iridescence: 0.12, amp: 0.12, freq: 0.8, speed: 0.28, ridges: 0 },
};

export interface TextureInfo {
  key: Exclude<TextureKey, "perle">;
  name: string;
  touch: string;
  description: string;
}

/** Descriptions générales de familles de textures (vocabulaire cosmétique courant, sans allégation). */
export const TEXTURE_INFOS: TextureInfo[] = [
  { key: "serum", name: "Sérum", touch: "Fluide · concentré", description: "Une texture légère qui se dépose en quelques gouttes et pénètre sans laisser de film." },
  { key: "creme", name: "Crème", touch: "Riche · enveloppante", description: "Une matière onctueuse, au toucher velouté, qui apporte une sensation de confort." },
  { key: "gel", name: "Gel", touch: "Frais · aqueux", description: "Une texture translucide et fraîche, qui fond au contact de la peau." },
  { key: "huile", name: "Huile", touch: "Satinée · nourrissante", description: "Une texture qui glisse, laisse un fini satiné et accompagne les gestes de massage." },
];

export const POSTERS: Record<TextureKey, string> = {
  perle: "/media/matter/perle",
  serum: "/media/matter/serum",
  creme: "/media/matter/creme",
  gel: "/media/matter/gel",
  huile: "/media/matter/huile",
};
