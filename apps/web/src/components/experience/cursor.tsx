"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isFinePointer, prefersReducedMotion } from "./motion-env";
import styles from "./cursor.module.css";

const INTERACTIVE = "a, button, [role='tab'], label, select, input, textarea, summary, [data-cursor]";

/**
 * Curseur de marque (souris uniquement) : point qui suit exactement, anneau amorti qui grandit sur les éléments
 * interactifs et affiche un libellé (`data-cursor="Voir"`). Boutons magnétiques : `data-magnetic`.
 * Le curseur système reste actif (aucune perte d'accessibilité) ; l'anneau est purement décoratif.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion() || !dot.current || !ring.current) return;
    document.documentElement.dataset.cursorActive = "";
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    let magnet: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        gsap.to(magnet, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.6, ease: "power3" });
      }
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);
      ring.current!.dataset.state = target ? "hover" : "";
      const text = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      label.current!.textContent = text;
      ring.current!.dataset.label = text ? "on" : "";
      const nextMagnet = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet !== nextMagnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      magnet = nextMagnet;
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "back.out(3)" });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      delete document.documentElement.dataset.cursorActive;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={ring} className={styles.ring}>
        <span ref={label} className={styles.label} />
      </div>
      <div ref={dot} className={styles.dot} />
    </div>
  );
}
