"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Progression (0..1) d'un élément traversant la fenêtre, calculée au défilement natif (aucune
 * interception du défilement). Écrit aussi la variable CSS --progress sur l'élément pour les effets
 * purement CSS. Retourne 0 si l'utilisateur préfère réduire les animations.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, { mode = "through" }: { mode?: "through" | "sticky" } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let active = false;

    const compute = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "sticky") {
        // 0 quand le haut de la section atteint le haut de l'écran, 1 quand sa fin quitte l'écran
        const distance = rect.height - vh;
        p = distance > 0 ? -rect.top / distance : 0;
      } else {
        p = (vh - rect.top) / (vh + rect.height);
      }
      p = Math.min(1, Math.max(0, p));
      el.style.setProperty("--progress", p.toFixed(4));
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
    };

    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(compute);
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = Boolean(entry?.isIntersecting);
      if (active) onScroll();
    });
    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, mode]);

  return progress;
}
