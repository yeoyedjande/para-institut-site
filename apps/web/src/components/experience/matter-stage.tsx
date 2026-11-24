"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MatterEngine, Pose } from "@/components/matter/engine";
import { webglSupport } from "@/components/matter/support";
import type { TextureKey } from "@/components/matter/textures";
import { EVENTS, isDesktop, prefersReducedMotion } from "./motion-env";
import styles from "./matter-stage.module.css";

interface StageConfig {
  desktop: Pose;
  mobile: Pose;
  texture?: TextureKey;
  mood: "light" | "dark";
}

/** Chorégraphie de la goutte : où elle se tient, quelle matière, sur quel fond, pour chaque section `data-stage`. */
export const STAGES: Record<string, StageConfig> = {
  hero: { desktop: { x: 0.5, y: -0.02, scale: 0.98 }, mobile: { x: 0.1, y: -0.6, scale: 0.55 }, texture: "serum", mood: "light" },
  manifesto: { desktop: { x: -0.66, y: 0.18, scale: 0.46 }, mobile: { x: 0.72, y: 0.74, scale: 0.24 }, texture: "huile", mood: "light" },
  lab: { desktop: { x: 0.02, y: -0.06, scale: 0.92 }, mobile: { x: 0, y: -0.08, scale: 0.58 }, mood: "dark" },
  finale: { desktop: { x: 0.58, y: 0.2, scale: 0.72 }, mobile: { x: 0.42, y: 0.62, scale: 0.36 }, texture: "perle", mood: "dark" },
};

/**
 * Scène 3D unique, fixée derrière la page d'accueil : la goutte voyage d'une section à l'autre, change de matière,
 * ondule avec la vitesse de défilement. Démarrage différé (après chargement ; au premier geste sur mobile),
 * arrêtée quand aucune section ne la montre. Sans WebGL : les visuels statiques des sections restent affichés.
 */
export function MatterStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const support = webglSupport();
    if (support === "none") return;
    gsap.registerPlugin(ScrollTrigger);

    let engine: MatterEngine | null = null;
    let cancelled = false;
    let active: string | null = null;
    let labTexture: TextureKey = "serum";
    const triggers: ScrollTrigger[] = [];
    const cleanups: Array<() => void> = [];

    const apply = (name: string | null) => {
      active = name;
      if (!engine) return;
      if (!name) {
        gsap.to(canvas, { autoAlpha: 0, duration: 0.6, onComplete: () => !active && engine?.stop() });
        return;
      }
      const cfg = STAGES[name]!;
      engine.setPose(isDesktop() ? cfg.desktop : cfg.mobile);
      engine.setMood(cfg.mood);
      engine.setTexture(name === "lab" ? labTexture : (cfg.texture ?? "perle"));
      if (document.visibilityState === "visible") engine.start();
      gsap.to(canvas, { autoAlpha: 1, duration: 0.9, ease: "power2.out" });
    };

    const boot = async () => {
      if (engine || cancelled) return;
      const { MatterEngine } = await import("@/components/matter/engine");
      if (cancelled) return;
      engine = new MatterEngine(canvas, {
        texture: "serum",
        stage: true,
        quality: support,
        onFirstFrame: () => document.documentElement.setAttribute("data-stage-live", ""),
        onFailure: () => {
          document.documentElement.removeAttribute("data-stage-live");
          gsap.set(canvas, { autoAlpha: 0 });
        },
      });
      const first = STAGES[active ?? "hero"]!;
      engine.setPose(isDesktop() ? first.desktop : first.mobile, true);
      apply(active);

      document.querySelectorAll<HTMLElement>("[data-stage]").forEach((el) => {
        const name = el.dataset.stage!;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (self.isActive) apply(name);
              else if (active === name) apply(null);
            },
          }),
        );
      });
      // Démarrage en haut de page : la section du héros est déjà active
      if (window.scrollY < window.innerHeight * 0.4) apply("hero");
    };

    const onVelocity = (e: Event) => engine?.setVelocity((e as CustomEvent<number>).detail);
    const onTexture = (e: Event) => {
      labTexture = (e as CustomEvent<TextureKey>).detail;
      if (active === "lab") engine?.setTexture(labTexture);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !engine) return;
      engine.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1), true);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      engine?.setScroll(max > 0 ? (window.scrollY / max) * 6 : 0);
    };
    const onVisibility = () => {
      if (!engine) return;
      if (document.visibilityState === "visible" && active) engine.start();
      else engine.stop();
    };
    window.addEventListener(EVENTS.velocity, onVelocity);
    window.addEventListener(EVENTS.texture, onTexture);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => {
      window.removeEventListener(EVENTS.velocity, onVelocity);
      window.removeEventListener(EVENTS.texture, onTexture);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    });

    // Ordinateur : au repos après le chargement. Mobile : au premier geste (ou après 3,5 s), pour ne pas
    // concurrencer le premier affichage sur un réseau ou un processeur modestes.
    const startWhenReady = () => {
      if (support === "high") {
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) ric(() => void boot(), { timeout: 1500 });
        else window.setTimeout(() => void boot(), 600);
        return;
      }
      const go = () => {
        ["pointerdown", "touchstart", "wheel", "keydown", "scroll"].forEach((t) => window.removeEventListener(t, go));
        void boot();
      };
      ["pointerdown", "touchstart", "wheel", "keydown", "scroll"].forEach((t) => window.addEventListener(t, go, { once: true, passive: true }));
      const id = window.setTimeout(go, 3500);
      cleanups.push(() => window.clearTimeout(id));
    };
    if (document.readyState === "complete") startWhenReady();
    else window.addEventListener("load", startWhenReady, { once: true });

    return () => {
      cancelled = true;
      triggers.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
      window.removeEventListener("load", startWhenReady);
      engine?.dispose();
      document.documentElement.removeAttribute("data-stage-live");
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.stage} aria-hidden="true" />;
}
