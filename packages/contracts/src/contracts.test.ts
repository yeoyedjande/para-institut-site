import { describe, expect, it } from "vitest";
import { canTransition, formatXof, isCurrent, isPublishable, publishable } from "./index";

describe("provenance", () => {
  it("ne publie que les informations vérifiées en production", () => {
    expect(isPublishable("VERIFIED", "production")).toBe(true);
    expect(isPublishable("HISTORICAL", "production")).toBe(false);
    expect(isPublishable("TO_CONFIRM", "production")).toBe(false);
    expect(isPublishable("DEMO_ONLY", "production")).toBe(false);
  });
  it("affiche tout en mode démo", () => {
    expect(publishable([{ status: "DEMO_ONLY" as const }, { status: "VERIFIED" as const }], "demo")).toHaveLength(2);
    expect(publishable([{ status: "DEMO_ONLY" as const }, { status: "VERIFIED" as const }], "production")).toHaveLength(1);
  });
});

describe("formatXof", () => {
  it("formate avec espaces fines insécables", () => {
    expect(formatXof(12500)).toBe("12 500 FCFA");
    expect(formatXof(0)).toBe("0 FCFA");
  });
  it("refuse les montants non entiers ou négatifs", () => {
    expect(() => formatXof(10.5)).toThrow(RangeError);
    expect(() => formatXof(-1)).toThrow(RangeError);
  });
});

describe("commandes", () => {
  it("interdit de revenir d'une commande annulée", () => {
    expect(canTransition("CANCELLED", "CONFIRMED")).toBe(false);
    expect(canTransition("PENDING_CONFIRMATION", "CONFIRMED")).toBe(true);
  });
});

describe("actualités", () => {
  it("n'est plus actuelle après sa date de fin", () => {
    const now = new Date("2026-12-08T00:00:00Z");
    expect(isCurrent({ endsAt: "2026-12-07T19:00:00+00:00" }, now)).toBe(false);
    expect(isCurrent({ endsAt: null }, now)).toBe(true);
  });
});
