import { ProvenanceBadge } from "@para/ui";
import { FrondIcon } from "@/components/layout/icons";
import { getBrands } from "@/content/catalog";
import { IS_DEMO } from "@/lib/content-mode";
import styles from "./brands.module.css";

/**
 * Section 08 — Marques. Présentation sobre, typographique (aucun logo de marque reproduit). Les marques
 * sont gérées en back-office ; seules les marques VERIFIED apparaissent en production.
 */
export function Brands() {
  const brands = getBrands();
  if (!brands.length) return null;
  return (
    <section className={styles.section} aria-labelledby="brands-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <p className="eyebrow">08 — Marques</p>
          <h2 id="brands-title" className={styles.title}>
            Des marques de dermocosmétique, <em>choisies avec soin.</em>
          </h2>
        </div>
        <ul role="list" className={styles.list}>
          {brands.map((b, i) => (
            <li key={b.id} className={styles.brand}>
              {i > 0 ? <FrondIcon className={styles.frond} /> : null}
              <span className={styles.name}>{b.name}</span>
              {IS_DEMO ? <ProvenanceBadge status={b.status} className={styles.badge} /> : null}
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Marques citées dans de précédentes communications de l&apos;institut. Disponibilités à confirmer en boutique ; aucune relation de
          partenariat n&apos;est sous-entendue.
        </p>
      </div>
    </section>
  );
}
