/**
 * Contrats du futur tunnel de commande (V1 : confirmation manuelle, règlement à la livraison ou au retrait).
 * Le statut de commande et le statut de règlement sont indépendants (docs/business/BUSINESS_RULES.md).
 */
export const ORDER_STATUSES = [
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["UNPAID", "PAID", "PARTIALLY_REFUNDED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const FULFILMENT_MODES = ["DELIVERY_ABIDJAN", "PICKUP_INSTITUTE"] as const;
export type FulfilmentMode = (typeof FULFILMENT_MODES)[number];

export const PAYMENT_METHODS = ["CASH_ON_DELIVERY", "PAY_AT_PICKUP"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const BOOKING_REQUEST_STATUSES = [
  "REQUESTED",
  "CONFIRMED",
  "DECLINED",
  "RESCHEDULED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
] as const;
export type BookingRequestStatus = (typeof BOOKING_REQUEST_STATUSES)[number];

/** Transitions autorisées d'une commande (vérifiées aussi côté API). */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING_CONFIRMATION: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "CANCELLED"],
  READY_FOR_PICKUP: ["COMPLETED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from].includes(to);
}
