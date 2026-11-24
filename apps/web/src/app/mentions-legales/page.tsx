import type { Metadata } from "next";
import { Notice } from "@para/ui";
import { PageHero } from "@/components/page/page-hero";
import styles from "@/components/page/prose.module.css";
import { ESTABLISHMENT } from "@/content/establishment";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default function LegalPage() {
  const a = ESTABLISHMENT.address.value;
  return (
    <>
      <PageHero eyebrow="Informations" title="Mentions légales" />
      <section className="section container">
        <div className={styles.prose}>
          <Notice tone="warning" title="Page à compléter avant la mise en ligne">
            Raison sociale, forme juridique, numéro RCCM, compte contribuable, responsable de publication et hébergeur doivent être fournis par
            l&apos;établissement (docs/MISSING_INFORMATION.md). Aucune de ces informations n&apos;est inventée ici.
          </Notice>
          <h2>Éditeur</h2>
          <p>
            <strong>{ESTABLISHMENT.name.value}</strong> — {a.line}, {a.city}, {a.country}.
          </p>
          <p>Raison sociale, RCCM, compte contribuable : à confirmer.</p>
          <h2>Hébergement</h2>
          <p>Hébergement prévu : Railway (à confirmer lors de la mise en production).</p>
          <h2>Propriété intellectuelle</h2>
          <p>Le logo Para-Institut Palm Club est la propriété de l&apos;établissement. Les illustrations 3D du site sont des créations originales.</p>
        </div>
      </section>
    </>
  );
}
