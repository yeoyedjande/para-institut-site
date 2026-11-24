"use client";

import { useEffect, useRef } from "react";
import { EVENTS, prefersReducedMotion } from "@/components/experience/motion-env";
import styles from "./marquee.module.css";

/**
 * Bandeau typographique infini. Sa vitesse et son inclinaison réagissent à la vitesse de défilement
 * (sensation de matière qui suit le geste). Décoratif : masqué aux lecteurs d'écran.
 */
export function Marquee({ items, reverse = false, tone = "outline" }: { items: string[]; reverse?: boolean; tone?: "outline" | "solid" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let skew = 0;
    let target = 0;
    let frame = 0;
    const onVelocity = (e: Event) => {
      target = Math.max(-12, Math.min(12, (e as CustomEvent<number>).detail * 0.35));
    };
    const loop = () => {
      skew += (target - skew) * 0.08;
      target *= 0.92;
      el.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
      frame = requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry?.isIntersecting) frame = requestAnimationFrame(loop);
    });
    observer.observe(el);
    window.addEventListener(EVENTS.velocity, onVelocity);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener(EVENTS.velocity, onVelocity);
    };
  }, []);

  const row = items.map((item, i) => (
    <span key={i} className={styles.item}>
      {item}
      <span className={styles.star}>✦</span>
    </span>
  ));
  return (
    <div ref={ref} className={`${styles.marquee} ${styles[tone]}`} data-reverse={reverse || undefined} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.group}>{row}</div>
        <div className={styles.group}>{row}</div>
      </div>
    </div>
  );
}
