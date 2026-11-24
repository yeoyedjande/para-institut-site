"use client";

import { useState } from "react";
import type { Product } from "@para/contracts";
import { ArrowIcon, Button } from "@para/ui";
import { useCart } from "@/components/cart/cart-context";
import styles from "./add-to-cart.module.css";

export function AddToCart({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const soldOut = product.availability === "OUT_OF_STOCK";
  return (
    <div className={styles.wrap}>
      <div className={styles.qty} role="group" aria-label="Quantité">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité" disabled={soldOut || qty <= 1}>
          −
        </button>
        <output aria-live="polite" aria-label="Quantité choisie">
          {qty}
        </output>
        <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Augmenter la quantité" disabled={soldOut || qty >= 10}>
          +
        </button>
      </div>
      <Button
        size="lg"
        className={styles.add}
        disabled={soldOut}
        onClick={() => {
          add({ slug: product.slug, name: product.name, priceXof: product.priceXof }, qty);
          setOpen(true);
        }}
      >
        {soldOut ? "Épuisé" : "Ajouter au panier"} {soldOut ? null : <ArrowIcon />}
      </Button>
    </div>
  );
}
