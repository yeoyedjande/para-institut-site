import { ESTABLISHMENT, PHONES } from "@/content/establishment";
import { SITE_URL } from "./content-mode";

/**
 * Données structurées schema.org limitées aux informations VERIFIED : pas d'horaires, d'avis ni de notes
 * tant qu'ils ne sont pas confirmés par l'établissement.
 */
export function localBusinessJsonLd() {
  const a = ESTABLISHMENT.address.value;
  return {
    "@context": "https://schema.org",
    "@type": ["HealthAndBeautyBusiness", "Store"],
    "@id": `${SITE_URL}/#etablissement`,
    name: ESTABLISHMENT.name.value,
    alternateName: ESTABLISHMENT.logoName.value,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo_para.jpg`,
    image: `${SITE_URL}/brand/logo_para.jpg`,
    telephone: PHONES[0]?.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.line,
      addressLocality: a.city,
      addressCountry: a.countryCode,
    },
    areaServed: { "@type": "City", name: "Abidjan" },
    currenciesAccepted: "XOF",
  };
}
