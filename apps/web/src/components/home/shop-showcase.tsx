import Link from "next/link";
import { ArrowIcon, EmptyState, buttonClass } from "@para/ui";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { categoryName, getCategories, getProducts } from "@/content/catalog";
import { PHONES, whatsappHref } from "@/content/establishment";
import { IS_DEMO } from "@/lib/content-mode";
import styles from "./shop-showcase.module.css";

/** Section 05 — Boutique : catégories et produits mis en avant (démo isolée, vide en production). */
export function ShopShowcase() {
  const categories = getCategories();
  const products = getProducts().slice(0, 4);
  const phone = PHONES[0];
  return (
    <section className={`section ${styles.section}`} aria-labelledby="shop-title">
      <div className={`container ${styles.head}`}>
        <Reveal className={styles.headText}>
          <p className="eyebrow">05 — La parapharmacie</p>
          <h2 id="shop-title" className="h2">
            Le bon soin, <em className={styles.em}>bien conseillé.</em>
          </h2>
        </Reveal>
        <Reveal className={styles.headAside} delay={120}>
          <p className="lede">
            Produits de soins, de beauté et de dermocosmétique. En V1 : commande sans compte, livraison à Abidjan ou retrait à l&apos;institut,
            règlement à la livraison ou au retrait.
          </p>
          <Link href="/boutique" className={buttonClass("secondary")}>
            Toute la boutique <ArrowIcon />
          </Link>
        </Reveal>
      </div>

      {products.length ? (
        <>
          <nav className="container" aria-label="Catégories de la boutique">
            <ul role="list" className={styles.categories}>
              {categories.map((c, i) => (
                <li key={c.id}>
                  <Link href={`/boutique?categorie=${c.slug}`} className={styles.category}>
                    <span className={styles.catIndex}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.catName}>{c.name}</span>
                    <span className={styles.catDesc}>{c.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={`container ${styles.railWrap}`}>
            {IS_DEMO ? (
              <p className={`proto-flag ${styles.flag}`}>Produits, prix et catégories de démonstration — le catalogue réel sera saisi en back-office.</p>
            ) : null}
            <ul role="list" className={styles.rail}>
              {products.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 90} className={styles.item}>
                  <ProductCard product={p} category={categoryName(p.categoryId)} />
                </Reveal>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="container">
          <EmptyState
            title="Le catalogue en ligne ouvre bientôt"
            action={
              phone ? (
                <a href={whatsappHref(phone.e164, "Bonjour, je cherche un produit.")} className={buttonClass("primary")} target="_blank" rel="noopener noreferrer">
                  Demander un produit sur WhatsApp
                </a>
              ) : null
            }
          >
            En attendant, notre équipe vous renseigne sur les produits disponibles à l&apos;institut.
          </EmptyState>
        </div>
      )}
    </section>
  );
}
