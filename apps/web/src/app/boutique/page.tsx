import type { Metadata } from "next";
import { EmptyState, buttonClass } from "@para/ui";
import { PageHero } from "@/components/page/page-hero";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { getCategories, getProducts } from "@/content/catalog";
import { PHONES, whatsappHref } from "@/content/establishment";
import { IS_DEMO } from "@/lib/content-mode";
import { Notice } from "@para/ui";

export const metadata: Metadata = {
  title: "Boutique — parapharmacie et soins",
  description: "Produits de soins, de beauté et de dermocosmétique de la parapharmacie Para Institut du Palm Club, à Abidjan.",
  alternates: { canonical: "/boutique" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ categorie?: string }> }) {
  const { categorie } = await searchParams;
  const products = getProducts();
  const phone = PHONES[0];
  return (
    <>
      <PageHero
        eyebrow="Boutique · Parapharmacie"
        title={
          <>
            Soins, beauté <em>&amp; dermocosmétique.</em>
          </>
        }
        lede="Commande sans compte, livraison à Abidjan ou retrait à l'institut, règlement à la livraison ou au retrait. Chaque commande est confirmée par l'équipe."
      />
      <section className="section container" aria-label="Catalogue">
        {IS_DEMO ? (
          <Notice tone="warning" title="Catalogue de démonstration">
            Les produits, prix et catégories ci-dessous sont fictifs et servent à valider les gabarits. Le catalogue réel sera saisi
            manuellement depuis le back-office ; aucune commande n&apos;est transmise.
          </Notice>
        ) : null}
        <div style={{ marginTop: "var(--space-6)" }}>
          {products.length ? (
            <ShopBrowser products={products} categories={getCategories()} initialCategory={categorie ?? null} />
          ) : (
            <EmptyState
              title="Le catalogue en ligne ouvre bientôt"
              action={
                phone ? (
                  <a className={buttonClass("primary")} href={whatsappHref(phone.e164, "Bonjour, je cherche un produit.")} target="_blank" rel="noopener noreferrer">
                    Demander un produit sur WhatsApp
                  </a>
                ) : null
              }
            >
              Notre équipe vous renseigne sur les produits disponibles à l&apos;institut.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
