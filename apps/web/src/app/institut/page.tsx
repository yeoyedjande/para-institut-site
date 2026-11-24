import type { Metadata } from "next";
import { Expertise } from "@/components/home/expertise";
import { Universes } from "@/components/home/universes";
import { Visit } from "@/components/home/visit";
import { PageHero } from "@/components/page/page-hero";

export const metadata: Metadata = {
  title: "Notre institut",
  description: "Para Institut du Palm Club réunit un institut de détente et de beauté et une parapharmacie, dans la galerie marchande de l'Hôtel Palm Club à Abidjan.",
  alternates: { canonical: "/institut" },
};

export default function InstitutPage() {
  return (
    <>
      <PageHero
        eyebrow="Notre institut"
        title={
          <>
            Deux univers, <em>une même attention.</em>
          </>
        }
        lede="Situé au sein de la galerie marchande de l'Hôtel Palm Club, Para Institut du Palm Club réunit un institut de détente et de beauté et un espace parapharmacie. Son univers privilégie le bien-être, l'écoute, le conseil et l'accompagnement."
      />
      <Universes />
      <Expertise />
      <Visit />
    </>
  );
}
