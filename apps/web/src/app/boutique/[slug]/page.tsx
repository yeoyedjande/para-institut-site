import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Notice, ProvenanceBadge } from "@para/ui";
import { Poster } from "@/components/home/poster";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ProductCard } from "@/components/shop/product-card";
import { AVAILABILITY_TONE, priceLabel, textureVisual } from "@/components/shop/product-utils";
import { AVAILABILITY_LABELS, categoryName, getProduct, getProducts } from "@/content/catalog";
import styles from "./product.module.css";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/boutique/${product.slug}` },
    // Une fiche de démonstration n'est jamais indexée
    robots: product.status === "VERIFIED" ? undefined : { index: false, follow: false },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = categoryName(product.categoryId);
  const related = getProducts()
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className={`container ${styles.layout}`}>
        <div className={styles.visual}>
          <div className={styles.visualInner}>
            <Poster texture={textureVisual(product.texture)} alt="" className={styles.poster} sizes="(max-width: 900px) 90vw, 50vw" eager />
            <p className={styles.visualNote}>Visuel indicatif de texture — la photographie du produit sera ajoutée en back-office.</p>
          </div>
        </div>

        <div className={styles.info}>
          <nav aria-label="Fil d'Ariane" className={styles.crumbs}>
            <ol role="list">
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/boutique">Boutique</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
          <div className={styles.badges}>
            {product.status !== "VERIFIED" ? <ProvenanceBadge status={product.status} /> : null}
            <Badge tone={AVAILABILITY_TONE[product.availability]} dot>
              {AVAILABILITY_LABELS[product.availability]}
            </Badge>
          </div>
          <p className="eyebrow">
            {category}
            {product.volume ? ` · ${product.volume}` : ""}
          </p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{priceLabel(product)}</p>
          <p className={styles.short}>{product.shortDescription}</p>

          {product.status === "DEMO_ONLY" ? (
            <Notice tone="warning" title="Fiche de démonstration">
              Ce produit n&apos;existe pas au catalogue : nom, description et prix sont fictifs.
            </Notice>
          ) : null}

          <AddToCart product={product} />

          <ul role="list" className={styles.services}>
            <li>
              <strong>Livraison à Abidjan</strong>
              <span>Frais communiqués avant toute confirmation de commande.</span>
            </li>
            <li>
              <strong>Retrait à l&apos;institut</strong>
              <span>Galerie marchande de l&apos;Hôtel Palm Club.</span>
            </li>
            <li>
              <strong>Règlement à la livraison ou au retrait</strong>
              <span>Aucun paiement en ligne n&apos;est demandé.</span>
            </li>
          </ul>

          <div className={styles.details}>
            <details open>
              <summary>Description</summary>
              <p>{product.description ?? product.shortDescription}</p>
            </details>
            <details>
              <summary>Conseils d&apos;utilisation</summary>
              <p>Renseignés en back-office à partir des informations de la marque.</p>
            </details>
            <details>
              <summary>Composition</summary>
              <p>Liste des ingrédients fournie par la marque, saisie en back-office.</p>
            </details>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="section container" aria-labelledby="related-title">
          <h2 id="related-title" className="h3" style={{ marginBottom: "var(--space-5)" }}>
            Vous aimerez aussi
          </h2>
          <ul role="list" className={styles.related}>
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} category={categoryName(p.categoryId)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
