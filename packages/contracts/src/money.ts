/** Montants en francs CFA (XOF), stockés en entiers (pas de centimes). */
export type AmountXof = number;

const nbsp = " ";

/** « 12 500 FCFA » avec espace fine insécable, format usuel en Côte d'Ivoire. */
export function formatXof(amount: AmountXof): string {
  if (!Number.isInteger(amount) || amount < 0) throw new RangeError("Montant XOF invalide");
  const digits = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, nbsp);
  return `${digits}${nbsp}FCFA`;
}
