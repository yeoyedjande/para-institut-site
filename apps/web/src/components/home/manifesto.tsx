"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/experience/motion-env";
import { SplitWords } from "./split";
import styles from "./manifesto.module.css";

const TEXT =
  "Un institut de détente et de beauté. Une parapharmacie. Deux univers réunis au cœur de la galerie marchande de l'Hôtel Palm Club, pour prendre soin de votre peau — avec écoute, conseil et douceur.";

/** Manifeste : les mots s'allument un à un au rythme du défilement. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        `.${styles.word}`,
        // Les mots « éteints » restent lisibles (gris turquoise ≥ 3:1 en grand corps) puis prennent l'encre
        { color: "#7d8f8b" },
        { color: "#0f2826", stagger: 0.08, ease: "none", scrollTrigger: { trigger: `.${styles.text}`, start: "top 78%", end: "bottom 42%", scrub: true } },
      );
      gsap.from(`.${styles.label}`, { yPercent: 100, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 75%" } });
    },
    { scope: ref },
  );
  return (
    <section ref={ref} className={styles.section} aria-label="Manifeste" data-stage="manifesto" data-mood="ivory">
      <div className={`container ${styles.grid}`}>
        <p className={`eyebrow ${styles.label}`}>Para Institut du Palm Club</p>
        <p className={styles.text}>
          <span className="sr-only">{TEXT}</span>
          <SplitWords text={TEXT} className={styles.word} />
        </p>
      </div>
    </section>
  );
}
