"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowIcon, buttonClass } from "@para/ui";
import { SERVICE_FAMILIES_CONTENT } from "@/content/services";
import { Poster } from "./poster";
import styles from "./rituals.module.css";

/**
 * Section 06 — Soins & bien-être. Ordinateur : la section s'épingle et les soins défilent horizontalement au rythme
 * du défilement vertical (les arches glissent en parallaxe). Mobile ou moins d'animations : carrousel horizontal
 * natif à accroche (glisser du doigt).
 */
export function Rituals() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(`.${styles.arch} img`).forEach((img) => {
          gsap.fromTo(img, { xPercent: -12, scale: 1.15 }, { xPercent: 12, scale: 1.15, ease: "none", scrollTrigger: { trigger: img, containerAnimation: move, start: "left right", end: "right left", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>(`.${styles.numeral}`).forEach((n) => {
          gsap.fromTo(n, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: n, containerAnimation: move, start: "left right", end: "right left", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={styles.section} aria-labelledby="soins-title" data-mood="sand">
      <div ref={trackRef} className={styles.track}>
        <div className={`${styles.panel} ${styles.intro}`}>
          <p className="eyebrow">06 — Soins &amp; bien-être</p>
          <h2 id="soins-title" className={styles.title}>
            Un temps <em>pour soi.</em>
          </h2>
          <p className="lede">
            Visage, corps, massages et spa. Les durées et tarifs de chaque prestation vous sont communiqués par l&apos;institut lors de la
            confirmation de votre rendez-vous.
          </p>
          <p className={styles.hint} aria-hidden="true">
            Faites défiler <ArrowIcon />
          </p>
        </div>

        {SERVICE_FAMILIES_CONTENT.map((s) => (
          <article key={s.family} className={`${styles.panel} ${styles.card}`} aria-labelledby={`soin-${s.family}`}>
            <span className={styles.numeral} aria-hidden="true">
              {s.index}
            </span>
            <div className={styles.arch}>
              <Poster texture={s.texture} alt="" sizes="(max-width: 900px) 70vw, 30vw" />
            </div>
            <div className={styles.cardText}>
              <h3 id={`soin-${s.family}`} className={styles.cardTitle}>
                {s.title}
              </h3>
              <p className={styles.cardLede}>{s.lede}</p>
              <Link href={`/soins/reservation?famille=${s.family}`} className={styles.cardLink} data-cursor="Réserver">
                Demander ce soin <ArrowIcon />
              </Link>
            </div>
          </article>
        ))}

        <div className={`${styles.panel} ${styles.outro}`}>
          <p className={styles.outroText}>
            Une demande n&apos;est pas un rendez-vous confirmé : l&apos;institut vous recontacte pour fixer le créneau.
          </p>
          <Link href="/soins/reservation" className={buttonClass("primary", "lg")} data-magnetic>
            Demander un rendez-vous <ArrowIcon />
          </Link>
          <Link href="/soins" className={buttonClass("ghost")}>
            Tous les soins
          </Link>
        </div>
      </div>
    </section>
  );
}
