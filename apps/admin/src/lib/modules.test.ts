import { describe, expect, it } from "vitest";
import { GROUPS, MODULES, getModule } from "./modules";

describe("modules du back-office", () => {
  it("couvre les 22 modules du périmètre V1 sans doublon", () => {
    expect(MODULES).toHaveLength(22);
    expect(new Set(MODULES.map((m) => m.slug)).size).toBe(MODULES.length);
  });
  it("chaque module appartient à un groupe connu et déclare une permission", () => {
    for (const m of MODULES) {
      expect(GROUPS).toContain(m.group);
      expect(m.permission).toMatch(/^[a-z]+:(read|write)$/);
    }
  });
  it("retrouve un module par son identifiant", () => {
    expect(getModule("commandes")?.label).toBe("Commandes");
    expect(getModule("inconnu")).toBeUndefined();
  });
});
