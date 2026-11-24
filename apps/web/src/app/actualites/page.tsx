import type { Metadata } from "next";
import { News } from "@/components/home/news";
import { PageHero } from "@/components/page/page-hero";

export const metadata: Metadata = {
  title: "Actualités & événements",
  description: "Événements, animations, nouveautés et conseils beauté de Para Institut du Palm Club.",
  alternates: { canonical: "/actualites" },
};

export const revalidate = 3600;

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Actualités & événements"
        title={
          <>
            Ce qui se passe <em>à l&apos;institut.</em>
          </>
        }
        lede="Animations commerciales, événements, nouveautés et conseils : publiés par l'équipe depuis le back-office. Une campagne passée n'est jamais présentée comme actuelle."
      />
      <News />
    </>
  );
}
