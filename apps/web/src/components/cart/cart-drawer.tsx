"use client";

import Link from "next/link";
import { formatXof } from "@para/contracts";
import { Button, EmptyState, Notice, Sheet, buttonClass } from "@para/ui";
import { useCart } from "./cart-context";
import styles from "./cart-drawer.module.css";

export function CartDrawer() {
  const { lines, subtotal, open, setOpen, setQty, remove } = useCart();
  return (
    <Sheet
      open={open}
      onClose={() => setOpen(false)}
      title="Votre panier"
      variant="drawer"
      footer={
        lines.length ? (
          <div className={styles.footer}>
            <p className={styles.total}>
              <span>Sous-total</span>
              <strong>{formatXof(subtotal)}</strong>
            </p>
            <p className={styles.small}>Frais de livraison communiqués avant toute confirmation. Règlement à la livraison ou au retrait.</p>
            <Button block disabled aria-describedby="cart-proto">
              Valider la commande
            </Button>
            <p id="cart-proto" className={styles.small}>
              Prototype : la commande en ligne n&apos;est pas encore active. Aucune donnée n&apos;est transmise.
            </p>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          title="Votre panier est vide"
          action={
            <Link href="/boutique" className={buttonClass("secondary", "sm")} onClick={() => setOpen(false)}>
              Découvrir la boutique
            </Link>
          }
        >
          Les produits que vous ajoutez sont conservés sur cet appareil.
        </EmptyState>
      ) : (
        <>
          <Notice tone="warning" title="Panier de démonstration">
            Les articles et prix affichés sont fictifs.
          </Notice>
          <ul role="list" className={styles.lines}>
            {lines.map((line) => (
              <li key={line.slug} className={styles.line}>
                <div>
                  <Link href={`/boutique/${line.slug}`} className={styles.name} onClick={() => setOpen(false)}>
                    {line.name}
                  </Link>
                  <p className={styles.price}>{line.priceXof !== null ? formatXof(line.priceXof) : "Prix communiqué en boutique"}</p>
                </div>
                <div className={styles.qty} role="group" aria-label={`Quantité de ${line.name}`}>
                  <button type="button" onClick={() => setQty(line.slug, line.qty - 1)} aria-label="Diminuer la quantité">
                    −
                  </button>
                  <output aria-live="polite">{line.qty}</output>
                  <button type="button" onClick={() => setQty(line.slug, line.qty + 1)} aria-label="Augmenter la quantité">
                    +
                  </button>
                </div>
                <button type="button" className={styles.remove} onClick={() => remove(line.slug)}>
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Sheet>
  );
}
