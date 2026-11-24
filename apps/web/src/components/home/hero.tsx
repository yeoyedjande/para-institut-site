"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowIcon, buttonClass } from "@para/ui";
import { prefersReducedMotion } from "@/components/experience/motion-env";
import { ESTABLISHMENT, PHONES, whatsappHref } from "@/content/establishment";
import { Poster, preloadPoster } from "./poster";
import { SplitChars } from "./split";
import styles from "./hero.module.css";

const LINES = [
  { text: "Votre peau.", italic: null },
  { text: "Votre beauté.", italic: null },
  { text: "expertise.", italic: "Notre" },
];

/** Index de la première lettre de chaque ligne (décalage de l'animation lettre par lettre). */
const STARTS = LINES.reduce<number[]>((acc, line, i) => {
  const prev = i === 0 ? 0 : acc[i - 1]! + (LINES[i - 1]!.italic ? LINES[i - 1]!.italic!.length + 1 : 0) + LINES[i - 1]!.text.length;
  acc.push(prev);
  return acc;
}, []);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const phone = PHONES[0];
  preloadPoster("serum", "(max-width: 900px) 80vw, 46vw");

  // Chorégraphie au défilement : les lignes s'écartent, le texte s'efface, la goutte prend le relais
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 } });
      tl.to("[data-line='0']", { xPercent: -14, ease: "none" }, 0)
        .to("[data-line='1']", { xPercent: 12, ease: "none" }, 0)
        .to("[data-line='2']", { xPercent: -8, ease: "none" }, 0)
        .to("[data-fade]", { yPercent: -60, autoAlpha: 0, ease: "none" }, 0)
        .to("[data-ring]", { rotate: 220, scale: 0.7, ease: "none" }, 0);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title" data-stage="hero" data-mood="ivory">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.fallback}>
        <Poster texture="serum" alt="Illustration 3D : une goutte de sérum turquoise translucide" eager sizes="(max-width: 900px) 80vw, 46vw" />
      </div>

      <div className={`container ${styles.top}`} data-fade>
        <p className={`eyebrow ${styles.eyebrow}`}>Institut de beauté · Parapharmacie · Abidjan</p>
      </div>

      <h1 id="hero-title" className={`container ${styles.title}`} aria-label="Votre peau. Votre beauté. Notre expertise.">
        {LINES.map((line, i) => {
          const start = STARTS[i]!;
          return (
            <span key={i} className={styles.line} data-line={i}>
              {line.italic ? (
                <em className={styles.italic}>
                  <SplitChars text={line.italic} start={start} className={styles.char} />{" "}
                </em>
              ) : null}
              <SplitChars text={line.text} start={start + (line.italic ? line.italic.length + 1 : 0)} className={styles.char} />
            </span>
          );
        })}
      </h1>

      <div className={`container ${styles.bottom}`} data-fade>
        <div className={styles.intro}>
          <p className={styles.lede}>
            Dans la galerie marchande de l&apos;Hôtel Palm Club, un institut de détente et de beauté et une parapharmacie réunis pour prendre soin
            de votre peau, avec écoute et conseil.
          </p>
          <div className={styles.ctas}>
            <Link href="/boutique" className={buttonClass("primary", "lg")} data-magnetic data-cursor="Boutique">
              Découvrir la boutique <ArrowIcon />
            </Link>
            <Link href="/soins/reservation" className={buttonClass("secondary", "lg")} data-magnetic>
              Réserver un soin
            </Link>
          </div>
        </div>
        <div className={styles.meta}>
          <p>{ESTABLISHMENT.address.value.line}</p>
          {phone ? (
            <a href={whatsappHref(phone.e164, "Bonjour Para Institut !")} target="_blank" rel="noopener noreferrer">
              WhatsApp {phone.display}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          ) : null}
          <span className={styles.scroll} aria-hidden="true">
            Défiler <span />
          </span>
        </div>
      </div>

      <svg className={styles.ring} viewBox="0 0 200 200" aria-hidden="true" data-ring>
        <defs>
          <path id="hero-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <text>
          <textPath href="#hero-ring">PARA-INSTITUT · PALM CLUB · ABIDJAN · BEYOND BEAUTY · </textPath>
        </text>
      </svg>
    </section>
  );
}
