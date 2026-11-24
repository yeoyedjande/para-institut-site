import type { ServiceFamily } from "@para/contracts";

export interface BookingDraft {
  family: ServiceFamily | "";
  date: string;
  moment: "matin" | "apres-midi" | "indifferent" | "";
  firstName: string;
  phone: string;
  message: string;
  consent: boolean;
}

export type BookingErrors = Partial<Record<keyof BookingDraft, string>>;

/** Validation côté client (l'API refera la validation côté serveur). */
export function validateBooking(d: BookingDraft, today: string): BookingErrors {
  const errors: BookingErrors = {};
  if (!d.family) errors.family = "Choisissez un type de soin.";
  if (!d.date) errors.date = "Indiquez une date souhaitée.";
  else if (d.date < today) errors.date = "La date souhaitée ne peut pas être passée.";
  if (!d.moment) errors.moment = "Indiquez un moment de la journée.";
  if (d.firstName.trim().length < 2) errors.firstName = "Indiquez votre prénom.";
  const digits = d.phone.replace(/[^\d+]/g, "");
  if (!/^\+?\d{8,15}$/.test(digits)) errors.phone = "Numéro invalide : indiquez l'indicatif, par exemple +225 07 00 00 00 00.";
  if (d.message.length > 500) errors.message = "500 caractères au maximum.";
  if (!d.consent) errors.consent = "Votre accord est nécessaire pour être recontacté(e).";
  return errors;
}

const MOMENTS = { matin: "le matin", "apres-midi": "l'après-midi", indifferent: "à n'importe quel moment", "": "" } as const;

/** Message WhatsApp récapitulatif : la cliente l'envoie elle-même, rien n'est stocké par le site. */
export function bookingMessage(d: BookingDraft, familyTitle: string): string {
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d.date}T00:00:00Z`));
  return [
    "Bonjour Para Institut,",
    `je souhaite demander un rendez-vous : ${familyTitle}.`,
    `Date souhaitée : ${date}, ${MOMENTS[d.moment]}.`,
    `Prénom : ${d.firstName.trim()} — téléphone : ${d.phone.trim()}.`,
    d.message.trim() ? `Précision : ${d.message.trim()}` : "",
    "Merci de me confirmer un créneau.",
  ]
    .filter(Boolean)
    .join("\n");
}
