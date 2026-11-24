"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowIcon, buttonClass } from "@para/ui";
import { Reveal } from "@/components/motion/reveal";
import { SERVICE_FAMILIES_CONTENT } from "@/content/services";
import { Poster } from "./poster";
import styles from "./rituals.module.css";

/**
 * Section 06 — Soins & bien-être. Sur ordinateur, la matière associée à chaque famille de soins suit
 * le pointeur ; sur mobile, elle est affichée dans la ligne.
 */
export function Rituals() {
  const [hovered, setHovered] = useState<string | null>(null);
  const followRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const followed = SERVICE_FAMILIES_CONTENT.find((s) => s.family === hovered);

  const onMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const list = listRef.current;
    const follow = followRef.current;
    if (!list || !follow) return;
    const rect = list.getBoundingClientRect();
    follow.style.transform = `translate3d(${event.clientX - rect.left}px, ${event.clientY - rect.top}px, 0)`;
  };

  return (
    <section className={`section ${styles.section}`} aria-labelledby="soins-title">
      <div className={`container ${styles.head}`}>
        <Reveal className={styles.headText}>
          <p className="eyebrow">06 — Soins &amp; bien-être</p>
          <h2 id="soins-title" className="h2">
            Un temps <em className={styles.em}>pour soi.</em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede">
            Visage, corps, massages et spa. Les durées et tarifs de chaque prestation vous sont communiqués par l&apos;institut lors de la
            confirmation de votre rendez-vous.
          </p>
        </Reveal>
      </div>

      <div className="container">
        <ol role="list" className={styles.list} ref={listRef} onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
          {SERVICE_FAMILIES_CONTENT.map((s, i) => (
            <Reveal as="li" key={s.family} delay={i * 80} className={styles.row} onPointerEnter={() => setHovered(s.family)}>
              <Link href={`/soins#${s.family}`} className={styles.link}>
                <span className={styles.index}>{s.index}</span>
                <span className={styles.title}>{s.title}</span>
                <span className={styles.lede}>{s.lede}</span>
                <span className={styles.arrow} aria-hidden="true">
                  <ArrowIcon />
                </span>
                <Poster texture={s.texture} alt="" className={styles.inline} sizes="96px" />
              </Link>
            </Reveal>
          ))}
          <div ref={followRef} className={styles.follow} aria-hidden="true" data-visible={hovered ? true : undefined}>
            {followed ? <Poster key={followed.family} texture={followed.texture} alt="" className={styles.followPoster} sizes="260px" /> : null}
          </div>
        </ol>
        <Reveal className={styles.cta}>
          <Link href="/soins/reservation" className={buttonClass("primary", "lg")}>
            Demander un rendez-vous <ArrowIcon />
          </Link>
          <p className={styles.note}>Une demande n&apos;est pas un rendez-vous confirmé : l&apos;institut vous recontacte pour fixer le créneau.</p>
        </Reveal>
      </div>
    </section>
  );
}
