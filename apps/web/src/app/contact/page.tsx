import type { Metadata } from "next";
import { Visit } from "@/components/home/visit";
import { PageHero } from "@/components/page/page-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Para Institut du Palm Club sur WhatsApp : +225 07 11 11 18 28 ou +225 07 11 11 18 31. Galerie marchande de l'Hôtel Palm Club, Abidjan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Nous sommes <em>à votre écoute.</em>
          </>
        }
        lede="Pour une question sur un soin, un produit ou une commande, écrivez-nous sur WhatsApp. Les coordonnées complètes figurent en bas de page."
      />
      <Visit />
    </>
  );
}
