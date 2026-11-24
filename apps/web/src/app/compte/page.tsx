import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, buttonClass } from "@para/ui";
import { PageHero } from "@/components/page/page-hero";

export const metadata: Metadata = { title: "Compte client", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Espace client"
        title={
          <>
            Votre <em>espace.</em>
          </>
        }
        lede="Profil, historique et suivi des commandes et des demandes de rendez-vous. Un lien de suivi sécurisé sera aussi envoyé pour les commandes passées sans compte."
      />
      <section className="section container">
        <EmptyState
          title="Espace client bientôt disponible"
          action={
            <Link href="/boutique" className={buttonClass("secondary")}>
              Continuer mes achats
            </Link>
          }
        >
          Fonctionnalité prévue en V1 (authentification, profil, commandes, réservations). Elle n&apos;est pas encore active dans ce prototype.
        </EmptyState>
      </section>
    </>
  );
}
