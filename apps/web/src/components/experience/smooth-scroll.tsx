"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { EVENTS, prefersReducedMotion } from "./motion-env";

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger. Le défilement reste celui du document :
 * pas d'interception, barre de défilement, ancres, clavier et lecteurs d'écran fonctionnent normalement.
 * Le tactile garde l'inertie native du téléphone. Désactivé si l'utilisateur préfère moins d'animations.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.dataset.motion = "reduced";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false, anchors: { offset: -80 } });
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    document.documentElement.dataset.experience = "on";

    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      window.dispatchEvent(new CustomEvent(EVENTS.velocity, { detail: e.velocity }));
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      delete document.documentElement.dataset.experience;
    };
  }, []);

  // Nouvelle page : repartir du haut et recalculer les déclencheurs
  useEffect(() => {
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
