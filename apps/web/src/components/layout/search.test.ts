import { describe, expect, it } from "vitest";
import { searchEntries, type SearchEntry } from "./search";

const index: SearchEntry[] = [
  { title: "Soins du visage", href: "/soins#visage", kind: "Soin" },
  { title: "Sérum hydratant", href: "/boutique/serum", kind: "Produit", description: "Texture fluide" },
  { title: "Contact", href: "/contact", kind: "Page" },
];

describe("recherche", () => {
  it("ignore accents et casse", () => {
    expect(searchEntries(index, "SERUM")[0]?.href).toBe("/boutique/serum");
  });
  it("exige tous les termes", () => {
    expect(searchEntries(index, "soins corps")).toHaveLength(0);
  });
  it("cherche aussi dans la description", () => {
    expect(searchEntries(index, "fluide")).toHaveLength(1);
  });
  it("requête vide : aucun résultat", () => {
    expect(searchEntries(index, "   ")).toHaveLength(0);
  });
});
