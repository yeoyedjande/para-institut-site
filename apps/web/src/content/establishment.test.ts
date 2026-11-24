import { describe, expect, it } from "vitest";
import { publishable } from "@para/contracts";
import { HOURS, PHONES, SOCIALS, whatsappHref } from "./establishment";
import { NEWS } from "./news";

describe("faits sur l'établissement", () => {
  it("les numéros publiés sont vérifiés et au format E.164 ivoirien", () => {
    for (const phone of PHONES) {
      expect(phone.status).toBe("VERIFIED");
      expect(phone.e164).toMatch(/^\+225\d{10}$/);
    }
  });
  it("les horaires non confirmés ne sont pas publiés en production", () => {
    expect(publishable(HOURS, "production")).toHaveLength(0);
    expect(publishable(SOCIALS, "production")).toHaveLength(0);
  });
  it("construit un lien WhatsApp sans le +", () => {
    expect(whatsappHref("+2250711111828", "Bonjour")).toBe("https://wa.me/2250711111828?text=Bonjour");
  });
  it("aucune actualité de démonstration n'est publiée en production", () => {
    expect(publishable(NEWS, "production").every((n) => n.status === "VERIFIED")).toBe(true);
  });
});
