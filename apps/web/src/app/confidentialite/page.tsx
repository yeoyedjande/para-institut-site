import type { Metadata } from "next";
import { Notice } from "@para/ui";
import { PageHero } from "@/components/page/page-hero";
import styles from "@/components/page/prose.module.css";

export const metadata: Metadata = { title: "Données personnelles", alternates: { canonical: "/confidentialite" } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Informations" title="Données personnelles" />
      <section className="section container">
        <div className={styles.prose}>
          <Notice tone="warning" title="Politique à valider juridiquement">
            Cette page décrit le fonctionnement du prototype. La politique définitive (base légale, durées de conservation, droits, responsable
            du traitement) doit être validée au regard de la loi ivoirienne n° 2013-450 relative à la protection des données personnelles.
          </Notice>
          <h2>Ce que fait le prototype</h2>
          <ul>
            <li>Le panier est conservé uniquement dans votre navigateur (stockage local). Il n&apos;est transmis à personne.</li>
            <li>Le formulaire de demande de rendez-vous ne stocke rien : il prépare un message que vous envoyez vous-même sur WhatsApp.</li>
            <li>Aucun outil de mesure d&apos;audience ni traceur publicitaire n&apos;est installé. Aucune police ni image n&apos;est chargée depuis un service tiers.</li>
          </ul>
          <h2>À venir</h2>
          <p>
            Les comptes clients, commandes et réservations seront stockés sur des serveurs dédiés, avec minimisation des données, journalisation
            des accès et durées de conservation définies.
          </p>
        </div>
      </section>
    </>
  );
}
