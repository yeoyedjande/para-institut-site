import { Brands } from "@/components/home/brands";
import { Expertise } from "@/components/home/expertise";
import { Hero } from "@/components/home/hero";
import { MatterLab } from "@/components/home/matter-lab";
import { News } from "@/components/home/news";
import { Rituals } from "@/components/home/rituals";
import { ShopShowcase } from "@/components/home/shop-showcase";
import { Universes } from "@/components/home/universes";
import { Visit } from "@/components/home/visit";

// Régénération horaire : une actualité terminée disparaît sans redéploiement.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Universes />
      <MatterLab />
      <ShopShowcase />
      <Rituals />
      <Expertise />
      <Brands />
      <News />
      <Visit />
    </>
  );
}
