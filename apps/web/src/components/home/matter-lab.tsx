"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENTS, prefersReducedMotion, scrollToY } from "@/components/experience/motion-env";
import { TEXTURE_INFOS } from "@/components/matter/textures";
import { Poster } from "./poster";
import { SplitChars } from "./split";
import styles from "./matter-lab.module.css";

/**
 * Section 04 — Laboratoire de la matière. Expérience enrichie : la section est épinglée et chaque palier de défilement
 * change la matière de la goutte 3D (scène globale). Les onglets restent pleinement utilisables (clic, flèches,
 * Début, Fin) ; sans animation ou sans WebGL, ce sont des onglets classiques avec visuels statiques.
 */
export function MatterLab() {
  const ref = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const id = useId();
  const current = TEXTURE_INFOS[index]!;
  const count = TEXTURE_INFOS.length;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(EVENTS.texture, { detail: current.key }));
  }, [current.key]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- activation après détection des préférences
    setPinned(true);
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        ref.current?.style.setProperty("--lab-progress", self.progress.toFixed(4));
        setIndex(Math.min(count - 1, Math.floor(self.progress * count)));
      },
    });
    return () => st.kill();
  }, [count]);

  const select = (i: number) => {
    const el = ref.current;
    if (pinned && el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      scrollToY(top + span * ((i + 0.5) / count));
    }
    setIndex(i);
  };

  const onKeyDown = (event: React.KeyboardEvent, i: number) => {
    const last = count - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = i === last ? 0 : i + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = i === 0 ? last : i - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <section
      ref={ref}
      className={styles.section}
      data-theme="inverse"
      data-pinned={pinned || undefined}
      aria-labelledby="lab-title"
      data-stage="lab"
      data-mood="ink"
      data-texture={current.key}
    >
      <div className={styles.sticky}>
        <p className={styles.giant} aria-hidden="true" key={current.key}>
          <SplitChars text={current.name} className={styles.giantChar} />
        </p>

        <div className={`container ${styles.layout}`}>
          <header className={styles.head}>
            <p className="eyebrow">04 — Laboratoire de la matière</p>
            <h2 id="lab-title" className={styles.title}>
              La texture, <em>première</em> sensation.
            </h2>
          </header>

          <div className={styles.tabs} role="tablist" aria-label="Familles de textures" ref={tabsRef} aria-orientation="vertical">
            {TEXTURE_INFOS.map((t, i) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`${id}-tab-${t.key}`}
                aria-selected={i === index}
                aria-controls={`${id}-panel`}
                tabIndex={i === index ? 0 : -1}
                className={styles.tab}
                onClick={() => select(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className={styles.tabIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.tabName}>{t.name}</span>
                <span className={styles.tabTouch}>{t.touch}</span>
              </button>
            ))}
          </div>

          <div className={styles.fallback} aria-hidden="true">
            <Poster texture={current.key} alt="" sizes="(max-width: 900px) 70vw, 34vw" />
          </div>

          <div className={styles.panel} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${current.key}`} tabIndex={0}>
            <p className={styles.panelName} key={current.key}>
              {current.name}
            </p>
            <p className={styles.panelText}>{current.description}</p>
            <p className={styles.disclaimer}>Représentation artistique des familles de textures. Elle ne figure aucun produit.</p>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span className={styles.counter}>
              <span>{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
            </span>
            <span className={styles.bar}>
              <span />
            </span>
            {pinned ? <span className={styles.hint}>Défilez pour changer de matière</span> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
