"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon, buttonClass } from "@para/ui";
import { useScrollProgress } from "@/components/motion/use-scroll-progress";
import { Poster } from "./poster";
import styles from "./universes.module.css";

/**
 * Section 03 — Deux univers. Version enrichie : la section reste « collée » pendant le défilement natif
 * et une goutte s'ouvre pour révéler la parapharmacie (aucune interception du défilement). Sans
 * JavaScript ou avec moins d'animations : les deux univers sont simplement empilés.
 */
export function Universes() {
  const ref = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const progress = useScrollProgress(ref, { mode: "sticky" });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnhanced(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Révélation entre 30 % et 70 % du parcours
  const reveal = enhanced ? Math.min(1, Math.max(0, (progress - 0.3) / 0.4)) : 1;
  const active = reveal > 0.5 ? "para" : "institut";

  const goTo = (target: "institut" | "para") => {
    const el = ref.current;
    if (!el) return;
    if (!enhanced) {
      document.getElementById(`univers-${target}`)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + distance * (target === "institut" ? 0.05 : 0.85), behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className={styles.section}
      data-enhanced={enhanced || undefined}
      aria-labelledby="univers-title"
      style={{ "--reveal": reveal.toFixed(4) } as React.CSSProperties}
    >
      <h2 id="univers-title" className="sr-only">
        Deux univers complémentaires
      </h2>
      <div className={styles.stage}>
        <article id="univers-institut" className={`${styles.panel} ${styles.institut} grain`} data-theme="inverse" aria-labelledby="u-institut">
          <div className={`container ${styles.inner}`}>
            <div className={styles.text}>
              <p className="eyebrow">03 — Deux univers · I</p>
              <h3 id="u-institut" className={styles.title}>
                L&apos;institut <em>de détente</em> et de beauté
              </h3>
              <p className="lede">Un lieu pour ralentir. Soins du visage et du corps, massages et spa : un temps pour soi, au calme.</p>
              <ul role="list" className={styles.tags}>
                <li>Soins du visage</li>
                <li>Soins du corps</li>
                <li>Massages</li>
                <li>Spa</li>
              </ul>
              <Link href="/soins" className={buttonClass("ghostInverse")} tabIndex={enhanced && active !== "institut" ? -1 : undefined}>
                Les soins <ArrowIcon />
              </Link>
            </div>
            <div className={styles.media}>
              <Poster texture="huile" alt="Illustration : goutte d'huile ambrée et satinée" className={styles.poster} />
            </div>
          </div>
        </article>

        <article
          id="univers-para"
          className={`${styles.panel} ${styles.para}`}
          aria-labelledby="u-para"
          aria-hidden={enhanced && reveal < 0.05 ? true : undefined}
        >
          <div className={`container ${styles.inner}`}>
            <div className={styles.text}>
              <p className={`eyebrow ${styles.eyebrowPara}`}>03 — Deux univers · II</p>
              <h3 id="u-para" className={styles.title}>
                La <em>parapharmacie</em>
              </h3>
              <p className={`lede ${styles.ledePara}`}>
                Des produits de soins et de beauté, de la dermocosmétique, et des conseils pour choisir ce qui convient à votre peau.
              </p>
              <ul role="list" className={styles.tags}>
                <li>Soins</li>
                <li>Beauté</li>
                <li>Dermocosmétique</li>
                <li>Conseil</li>
              </ul>
              <Link href="/boutique" className={buttonClass("inverse")} tabIndex={enhanced && reveal < 0.5 ? -1 : undefined}>
                La boutique <ArrowIcon />
              </Link>
            </div>
            <div className={styles.media}>
              <Poster texture="serum" alt="Illustration : goutte de sérum turquoise translucide" className={styles.poster} />
            </div>
          </div>
        </article>

        {enhanced ? (
          <div className={styles.switcher} role="group" aria-label="Choisir un univers">
            <button type="button" aria-pressed={active === "institut"} onClick={() => goTo("institut")}>
              Institut
            </button>
            <span className={styles.track} aria-hidden="true">
              <span />
            </span>
            <button type="button" aria-pressed={active === "para"} onClick={() => goTo("para")}>
              Parapharmacie
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
