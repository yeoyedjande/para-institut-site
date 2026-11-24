import Link from "next/link";
import { buttonClass } from "@para/ui";
import { PageHero } from "@/components/page/page-hero";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Erreur 404"
      title={
        <>
          Cette page s&apos;est <em>évaporée.</em>
        </>
      }
      lede="Le lien est peut-être incomplet, ou la page a été déplacée."
      aside={
        <Link href="/" className={buttonClass("primary", "lg", true)}>
          Retour à l&apos;accueil
        </Link>
      }
    />
  );
}
