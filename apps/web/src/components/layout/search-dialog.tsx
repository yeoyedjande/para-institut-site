"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Sheet, controlClass } from "@para/ui";
import { searchEntries, type SearchEntry } from "./search";
import styles from "./search-dialog.module.css";

export type { SearchEntry };

export function SearchDialog({ open, onClose, index }: { open: boolean; onClose: () => void; index: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const results = useMemo(() => searchEntries(index, query), [index, query]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} title="Rechercher">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="site-search" className="sr-only">
          Rechercher un produit, un soin ou une page
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          className={controlClass}
          placeholder="Un produit, un soin, une page…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-controls={resultsId}
          autoComplete="off"
        />
      </form>
      <div id={resultsId} className={styles.results} aria-live="polite">
        {query.trim() === "" ? (
          <p className={styles.hint}>Saisissez quelques lettres. Astuce : la touche « / » ouvre la recherche.</p>
        ) : results.length === 0 ? (
          <p className={styles.hint}>Aucun résultat pour « {query} ». Notre équipe peut vous orienter sur WhatsApp.</p>
        ) : (
          <ul role="list">
            {results.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={styles.result} onClick={onClose}>
                  <span className={styles.kind}>{r.kind}</span>
                  <span className={styles.title}>{r.title}</span>
                  {r.description ? <span className={styles.desc}>{r.description}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}
