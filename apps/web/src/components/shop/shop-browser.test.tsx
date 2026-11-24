import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/content/catalog";
import { filterProducts } from "./shop-browser";

describe("filtres de la boutique", () => {
  const base = { category: null, query: "", availableOnly: false, sort: "relevance" as const };
  it("filtre par catégorie", () => {
    const r = filterProducts(PRODUCTS, { ...base, category: "c-corps" });
    expect(r.every((p) => p.categoryId === "c-corps")).toBe(true);
  });
  it("exclut les produits épuisés ou sur commande si demandé", () => {
    const r = filterProducts(PRODUCTS, { ...base, availableOnly: true });
    expect(r.some((p) => p.availability === "OUT_OF_STOCK" || p.availability === "ON_REQUEST")).toBe(false);
  });
  it("trie par prix croissant", () => {
    const r = filterProducts(PRODUCTS, { ...base, sort: "price-asc" });
    const prices = r.map((p) => p.priceXof ?? 0);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });
  it("recherche sans tenir compte des accents", () => {
    expect(filterProducts(PRODUCTS, { ...base, query: "creme" }).length).toBeGreaterThan(0);
  });
});
