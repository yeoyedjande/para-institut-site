"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@para/contracts";
import { Badge, Button, Notice, ProvenanceBadge, Sheet, buttonClass } from "@para/ui";
import { useCart } from "@/components/cart/cart-context";
import { Poster } from "@/components/home/poster";
import { AVAILABILITY_LABELS } from "@/content/catalog";
import { AVAILABILITY_TONE, priceLabel, textureVisual } from "./product-utils";
import styles from "./product-card.module.css";

export function ProductCard({ product, category }: { product: Product; category: string }) {
  const { add, setOpen } = useCart();
  const [quick, setQuick] = useState(false);
  const soldOut = product.availability === "OUT_OF_STOCK";
  const href = `/boutique/${product.slug}`;

  const addToCart = () => {
    add({ slug: product.slug, name: product.name, priceXof: product.priceXof });
    setQuick(false);
    setOpen(true);
  };

  return (
    <article className={styles.card} aria-labelledby={`p-${product.id}`}>
      <div
        className={styles.media}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--rx", `${(((e.clientY - r.top) / r.height) - 0.5) * -10}deg`);
          e.currentTarget.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width) - 0.5) * 12}deg`);
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--rx", "0deg");
          e.currentTarget.style.setProperty("--ry", "0deg");
        }}
      >
        <Link href={href} tabIndex={-1} aria-hidden="true" className={styles.mediaLink} data-cursor="Voir">
          <Poster texture={textureVisual(product.texture)} alt="" className={styles.poster} sizes="(max-width: 640px) 70vw, 22vw" />
        </Link>
        <div className={styles.badges}>
          {product.status !== "VERIFIED" ? <ProvenanceBadge status={product.status} /> : null}
        </div>
        <button type="button" className={styles.quick} onClick={() => setQuick(true)}>
          Aperçu rapide<span className="sr-only"> : {product.name}</span>
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.category}>{category}</p>
        <h3 id={`p-${product.id}`} className={styles.name}>
          <Link href={href}>{product.name}</Link>
        </h3>
        <div className={styles.row}>
          <p className={styles.price}>{priceLabel(product)}</p>
          <Badge tone={AVAILABILITY_TONE[product.availability]} dot>
            {AVAILABILITY_LABELS[product.availability]}
          </Badge>
        </div>
        <Button variant="secondary" size="sm" block onClick={addToCart} disabled={soldOut}>
          {soldOut ? "Indisponible" : "Ajouter au panier"}
          <span className="sr-only"> : {product.name}</span>
        </Button>
      </div>

      <Sheet open={quick} onClose={() => setQuick(false)} title={product.name}>
        <div className={styles.quickGrid}>
          <Poster texture={textureVisual(product.texture)} alt="" className={styles.quickPoster} sizes="300px" />
          <div className={styles.quickBody}>
            {product.status === "DEMO_ONLY" ? (
              <Notice tone="warning" title="Produit de démonstration">
                Nom, description et prix fictifs : le catalogue réel sera saisi par l&apos;institut.
              </Notice>
            ) : null}
            <p className={styles.category}>
              {category}
              {product.volume ? ` · ${product.volume}` : ""}
            </p>
            <p>{product.shortDescription}</p>
            <p className={styles.price}>{priceLabel(product)}</p>
            <Badge tone={AVAILABILITY_TONE[product.availability]} dot>
              {AVAILABILITY_LABELS[product.availability]}
            </Badge>
            <div className={styles.quickActions}>
              <Button onClick={addToCart} disabled={soldOut}>
                Ajouter au panier
              </Button>
              <Link href={href} className={buttonClass("ghost")}>
                Voir la fiche
              </Link>
            </div>
          </div>
        </div>
      </Sheet>
    </article>
  );
}
