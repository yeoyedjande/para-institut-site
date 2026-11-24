"use client";

import { useEffect, useRef, useState } from "react";
import type { TextureKey } from "./textures";
import { POSTERS } from "./textures";
import styles from "./matter.module.css";

type EngineHandle = import("./engine").MatterEngine;

export interface MatterCanvasProps {
  texture: TextureKey;
  /** Texte alternatif du visuel (le canevas lui-même est décoratif). */
  alt: string;
  className?: string;
  /** Interaction au pointeur. */
  interactive?: boolean;
  /** Progression de défilement 0..1 transmise à la scène. */
  scrollProgress?: number;
  /** Mode capture : image fixe, pas de repli ni d'animation (outil de génération des visuels). */
  still?: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Visuel « matière » : affiche toujours d'abord l'image de repli (rendue depuis la même scène), puis,
 * si l'appareil s'y prête et que l'utilisateur n'a pas demandé moins d'animations, charge Three.js à la
 * demande et fond la scène 3D par-dessus. La scène s'arrête dès qu'elle sort de l'écran.
 */
export function MatterCanvas({ texture, alt, className, interactive = true, scrollProgress, still, priority, sizes = "(max-width: 768px) 90vw, 45vw" }: MatterCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  const [live, setLive] = useState(false);
  const [posterTexture, setPosterTexture] = useState(texture);

  // Chargement différé du moteur
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let visible = false;
    let idleHandle: number | undefined;

    const boot = async () => {
      const mod = await import("./engine");
      const support = still ? "high" : mod.webglSupport();
      if (cancelled || support === "none" || (reduced && !still)) return;
      try {
        const engine = new mod.MatterEngine(canvas, {
          texture,
          still,
          quality: support,
          onFirstFrame: () => !cancelled && setLive(true),
          onFailure: () => !cancelled && setLive(false),
        });
        engineRef.current = engine;
        if (visible && document.visibilityState === "visible") engine.start();
      } catch {
        setLive(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        const engine = engineRef.current;
        if (!engine) return;
        if (visible && document.visibilityState === "visible") engine.start();
        else engine.stop();
      },
      { rootMargin: "120px" },
    );
    observer.observe(wrap);

    const onVisibility = () => {
      const engine = engineRef.current;
      if (!engine) return;
      if (document.visibilityState === "visible" && visible) engine.start();
      else engine.stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Ne pas concurrencer le premier affichage : démarrage après le chargement, au repos du navigateur
    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (still) void boot();
      else if (ric) idleHandle = ric(() => void boot(), { timeout: 2500 });
      else idleHandle = window.setTimeout(() => void boot(), 800);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("load", schedule);
      if (idleHandle !== undefined) {
        const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
        if (cic) cic(idleHandle);
        clearTimeout(idleHandle);
      }
      engineRef.current?.dispose();
      engineRef.current = null;
    };
    // Le moteur est créé une seule fois ; les changements de texture passent par setTexture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setTexture(texture);
    // Sans 3D, l'image de repli suit la texture choisie
    if (!engineRef.current) setPosterTexture(texture);
  }, [texture]);

  useEffect(() => {
    if (scrollProgress !== undefined) engineRef.current?.setScroll(scrollProgress);
  }, [scrollProgress]);

  const onPointerMove = (event: React.PointerEvent) => {
    if (!interactive || !engineRef.current || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    engineRef.current.setPointer(x, y, true);
  };

  const poster = POSTERS[posterTexture];

  return (
    <div
      ref={wrapRef}
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      data-live={live || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={() => engineRef.current?.setPointer(0, 0, false)}
    >
      {still ? null : (
        <picture className={styles.poster}>
          <source srcSet={`${poster}-640.avif 640w, ${poster}-1200.avif 1200w`} type="image/avif" sizes={sizes} />
          <source srcSet={`${poster}-640.webp 640w, ${poster}-1200.webp 1200w`} type="image/webp" sizes={sizes} />
          <img
            src={`${poster}-1200.webp`}
            alt={alt}
            width={1200}
            height={1200}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </picture>
      )}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
