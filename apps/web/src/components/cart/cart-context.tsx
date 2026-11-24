"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartLine {
  slug: string;
  name: string;
  priceXof: number | null;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  announcement: string;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "para.cart.v1";
const MAX_QTY = 10;

/**
 * Panier du prototype : conservé uniquement dans ce navigateur (aucune donnée transmise). Le panier
 * serveur, la vérification de stock et la commande arrivent avec l'API (docs/specifications).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restauration unique après hydratation
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* stockage indisponible : panier vide */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* navigation privée ou stockage bloqué */
    }
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === line.slug);
      if (existing) return prev.map((l) => (l.slug === line.slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { ...line, qty: Math.min(MAX_QTY, qty) }];
    });
    setAnnouncement(`${line.name} ajouté au panier`);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))));
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
    setAnnouncement("Article retiré du panier");
  }, []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (l.priceXof ?? 0) * l.qty, 0);
    return { lines, count, subtotal, open, setOpen, add, setQty, remove, announcement };
  }, [lines, open, add, setQty, remove, announcement]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </CartContext.Provider>
  );
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}
