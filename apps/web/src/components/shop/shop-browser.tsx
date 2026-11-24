"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@para/contracts";
import { EmptyState, controlClass } from "@para/ui";
import { normalize } from "@/components/layout/search";
import { ProductCard } from "./product-card";
import styles from "./shop-browser.module.css";

type Sort = "relevance" | "price-asc" | "price-desc" | "name";

export function filterProducts(
  products: Product[],
  { category, query, availableOnly, sort }: { category: string | null; query: string; availableOnly: boolean; sort: Sort },
): Product[] {
  const q = normalize(query);
  const list = products.filter(
    (p) =>
      (!category || p.categoryId === category) &&
      (!availableOnly || p.availability === "IN_STOCK" || p.availability === "LOW_STOCK") &&
      (!q || normalize(`${p.name} ${p.shortDescription}`).includes(q)),
  );
  const price = (p: Product) => p.priceXof ?? Number.POSITIVE_INFINITY;
  if (sort === "price-asc") list.sort((a, b) => price(a) - price(b));
  if (sort === "price-desc") list.sort((a, b) => (b.priceXof ?? -1) - (a.priceXof ?? -1));
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return list;
}

export function ShopBrowser({ products, categories, initialCategory }: { products: Product[]; categories: Category[]; initialCategory: string | null }) {
  const [category, setCategory] = useState<string | null>(categories.find((c) => c.slug === initialCategory)?.id ?? null);
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("relevance");

  const results = useMemo(() => filterProducts(products, { category, query, availableOnly, sort }), [products, category, query, availableOnly, sort]);
  const name = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  const selectCategory = (id: string | null) => {
    setCategory(id);
    const slug = categories.find((c) => c.id === id)?.slug;
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("categorie", slug);
    else url.searchParams.delete("categorie");
    window.history.replaceState(null, "", url);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.toolbar} role="search" aria-label="Filtrer les produits">
        <div className={styles.chips} role="group" aria-label="Catégories">
          <button type="button" className={styles.chip} aria-pressed={category === null} onClick={() => selectCategory(null)}>
            Tout
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" className={styles.chip} aria-pressed={category === c.id} onClick={() => selectCategory(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
        <div className={styles.controls}>
          <label className={styles.searchLabel}>
            <span className="sr-only">Rechercher dans la boutique</span>
            <input type="search" className={controlClass} placeholder="Rechercher un produit" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label className={styles.inline}>
            <span className="sr-only">Trier</span>
            <select className={controlClass} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="relevance">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom (A → Z)</option>
            </select>
          </label>
          <label className={styles.check}>
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
            Disponible uniquement
          </label>
        </div>
      </div>

      <p className={styles.count} role="status" aria-live="polite">
        {results.length} produit{results.length > 1 ? "s" : ""}
      </p>

      {results.length ? (
        <ul role="list" className={styles.grid}>
          {results.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} category={name(p.categoryId)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Aucun produit ne correspond">Modifiez vos filtres, ou demandez conseil à notre équipe sur WhatsApp.</EmptyState>
      )}
    </div>
  );
}
