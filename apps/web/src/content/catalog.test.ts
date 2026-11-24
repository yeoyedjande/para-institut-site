import { describe, expect, it, vi } from "vitest";

describe("catalogue selon le mode de contenu", () => {
  it("en production, aucune donnée de démonstration n'est publiée", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_CONTENT_MODE", "production");
    const { getProducts, getCategories, getBrands } = await import("./catalog");
    expect(getProducts()).toHaveLength(0);
    expect(getCategories()).toHaveLength(0);
    expect(getBrands()).toHaveLength(0);
    vi.unstubAllEnvs();
  });

  it("en démo, les produits sont tous marqués DEMO_ONLY et sans marque", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_CONTENT_MODE", "demo");
    const { getProducts } = await import("./catalog");
    const products = getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.status === "DEMO_ONLY" && p.brandId === null)).toBe(true);
    vi.unstubAllEnvs();
  });
});
