"use client";

import { useId, useRef, useState } from "react";
import { MatterCanvas } from "@/components/matter/matter-canvas";
import { TEXTURE_INFOS, type TextureInfo } from "@/components/matter/textures";
import styles from "./matter-lab.module.css";

/**
 * Section 04 — Laboratoire de la matière : expérience signature. Le visiteur choisit une famille de
 * texture ; la goutte 3D change de matière (couleur, transparence, brillance, mouvement). Onglets ARIA
 * complets (flèches, Début, Fin), canevas décoratif, alternative statique automatique.
 */
export function MatterLab() {
  const [current, setCurrent] = useState<TextureInfo>(TEXTURE_INFOS[0]!);
  const tabsRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = TEXTURE_INFOS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setCurrent(TEXTURE_INFOS[next]!);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const index = TEXTURE_INFOS.findIndex((t) => t.key === current.key);

  return (
    <section className={`${styles.section} grain`} data-theme="inverse" aria-labelledby="lab-title" data-texture={current.key}>
      <div className={`container ${styles.head}`}>
        <p className="eyebrow">04 — Laboratoire de la matière</p>
        <h2 id="lab-title" className="h2">
          La texture, <em className={styles.em}>première</em> sensation.
        </h2>
        <p className="lede">
          Sérum, crème, gel ou huile : chaque texture a sa façon de toucher la peau. Choisissez une matière pour l&apos;observer en lumière.
        </p>
      </div>

      <div className={`container ${styles.stage}`}>
        <div className={styles.tabs} role="tablist" aria-label="Familles de textures" ref={tabsRef} aria-orientation="vertical">
          {TEXTURE_INFOS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`${id}-tab-${t.key}`}
              aria-selected={t.key === current.key}
              aria-controls={`${id}-panel`}
              tabIndex={t.key === current.key ? 0 : -1}
              className={styles.tab}
              onClick={() => setCurrent(t)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className={styles.tabIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.tabName}>{t.name}</span>
              <span className={styles.tabTouch}>{t.touch}</span>
            </button>
          ))}
        </div>

        <div className={styles.canvasWrap}>
          <div className={styles.halo} aria-hidden="true" />
          <MatterCanvas
            texture={current.key}
            className={styles.canvas}
            boot="visible"
            alt={`Illustration 3D de la texture ${current.name.toLowerCase()}`}
            sizes="(max-width: 768px) 92vw, 50vw"
          />
          <p className={styles.counter} aria-hidden="true">
            <span>{String(index + 1).padStart(2, "0")}</span> / {String(TEXTURE_INFOS.length).padStart(2, "0")}
          </p>
        </div>

        <div className={styles.panel} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${current.key}`} tabIndex={0}>
          <p className={styles.panelName} key={current.key}>
            {current.name}
          </p>
          <p className={styles.panelText}>{current.description}</p>
          <p className={styles.disclaimer}>Représentation artistique des familles de textures. Elle ne figure aucun produit.</p>
        </div>
      </div>
    </section>
  );
}
