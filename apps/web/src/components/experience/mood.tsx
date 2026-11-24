"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion-env";

export const MOODS: Record<string, string> = {
  ivory: "#fbf8f3",
  sand: "#f2ece2",
  mist: "#e6f3f2",
  ink: "#032523",
  abyss: "#003f3c",
};

/**
 * Ambiance chromatique : le fond de la page glisse d'une couleur à l'autre au fil des sections (`data-mood`).
 * Les sections deviennent transparentes uniquement quand ce contrôleur est actif (sinon chacune garde son fond).
 */
export function MoodController() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    root.setAttribute("data-mood-active", "");
    const body = document.body;
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-mood]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          // Seule la section active devient transparente : les autres gardent leur fond (contraste garanti)
          el.toggleAttribute("data-mood-current", self.isActive);
          if (self.isActive) gsap.to(body, { backgroundColor: MOODS[el.dataset.mood!] ?? MOODS.ivory, duration: 1, ease: "power2.out", overwrite: true });
        },
      }),
    );
    return () => {
      triggers.forEach((t) => t.kill());
      document.querySelectorAll("[data-mood-current]").forEach((el) => el.removeAttribute("data-mood-current"));
      root.removeAttribute("data-mood-active");
      gsap.set(body, { clearProps: "backgroundColor" });
    };
  }, []);
  return null;
}
