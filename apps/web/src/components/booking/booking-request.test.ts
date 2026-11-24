import { describe, expect, it } from "vitest";
import { bookingMessage, validateBooking, type BookingDraft } from "./booking-request";

const valid: BookingDraft = { family: "visage", date: "2026-12-12", moment: "matin", firstName: "Awa", phone: "+225 07 00 00 00 00", message: "", consent: true };

describe("demande de rendez-vous", () => {
  it("accepte une demande complète", () => {
    expect(validateBooking(valid, "2026-11-24")).toEqual({});
  });
  it("refuse une date passée et un téléphone invalide", () => {
    const errors = validateBooking({ ...valid, date: "2026-01-01", phone: "12" }, "2026-11-24");
    expect(errors.date).toBeDefined();
    expect(errors.phone).toBeDefined();
  });
  it("exige le consentement", () => {
    expect(validateBooking({ ...valid, consent: false }, "2026-11-24").consent).toBeDefined();
  });
  it("rédige un message qui demande une confirmation (pas un rendez-vous confirmé)", () => {
    const msg = bookingMessage(valid, "Soins du visage");
    expect(msg).toContain("samedi 12 décembre");
    expect(msg).toContain("Merci de me confirmer un créneau");
  });
});
