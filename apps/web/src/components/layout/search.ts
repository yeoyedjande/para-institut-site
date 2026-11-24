export interface SearchEntry {
  title: string;
  href: string;
  kind: "Page" | "Produit" | "Soin" | "Actualité";
  description?: string;
}

/** Normalise pour une recherche tolérante aux accents et à la casse. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function searchEntries(index: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return index
    .map((entry) => {
      const title = normalize(entry.title);
      const hay = `${title} ${normalize(entry.description ?? "")} ${normalize(entry.kind)}`;
      if (!terms.every((t) => hay.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (title.startsWith(t) ? 3 : title.includes(t) ? 2 : 1), 0);
      return { entry, score };
    })
    .filter((x): x is { entry: SearchEntry; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.entry);
}
