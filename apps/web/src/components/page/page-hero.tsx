import type { ReactNode } from "react";
import styles from "./page-hero.module.css";

/** En-tête des pages intérieures : composition éditoriale asymétrique. */
export function PageHero({ eyebrow, title, lede, aside, tone = "light" }: { eyebrow: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode; tone?: "light" | "dark" }) {
  return (
    <header className={`${styles.hero} ${tone === "dark" ? `${styles.dark} grain` : ""}`} data-theme={tone === "dark" ? "inverse" : undefined}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
    </header>
  );
}
