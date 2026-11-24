import { MatterStage } from "@/components/experience/matter-stage";
import { MoodController } from "@/components/experience/mood";
import { Intro } from "@/components/experience/intro";
import { Brands } from "@/components/home/brands";
import { Expertise } from "@/components/home/expertise";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { Marquee } from "@/components/home/marquee";
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
      <Intro />
      <MatterStage />
      <MoodController />
      <Hero />
      <Manifesto />
      <Marquee items={["Soins du visage", "Soins du corps", "Massages", "Spa"]} />
      <Universes />
      <MatterLab />
      <Rituals />
      <Marquee items={["Parapharmacie", "Dermocosmétique", "Conseil", "Beauté"]} reverse tone="solid" />
      <ShopShowcase />
      <Expertise />
      <Brands />
      <News />
      <Visit />
    </>
  );
}
