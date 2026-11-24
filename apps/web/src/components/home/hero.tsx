import Link from "next/link";
import { ArrowIcon, buttonClass } from "@para/ui";
import { MatterCanvas } from "@/components/matter/matter-canvas";
import { preloadPoster } from "./poster";
import { ESTABLISHMENT, PHONES, whatsappHref } from "@/content/establishment";
import styles from "./hero.module.css";

const LINES = [
  <>Votre peau.</>,
  <>Votre beauté.</>,
  <>
    <em>Notre</em> expertise.
  </>,
];

export function Hero() {
  const phone = PHONES[0];
  preloadPoster("perle", "(max-width: 768px) 80vw, 40vw");
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>Institut de beauté · Parapharmacie · Abidjan</p>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            {LINES.map((line, i) => (
              <span key={i} className={styles.line} style={{ "--i": i } as React.CSSProperties}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <p className={`lede ${styles.lede}`}>
            Dans la galerie marchande de l&apos;Hôtel Palm Club, un institut de détente et de beauté et une parapharmacie réunis pour prendre soin
            de votre peau, avec écoute et conseil.
          </p>
          <div className={styles.ctas}>
            <Link href="/boutique" className={buttonClass("primary", "lg")}>
              Découvrir la boutique <ArrowIcon />
            </Link>
            <Link href="/soins/reservation" className={buttonClass("secondary", "lg")}>
              Réserver un soin
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.arch}>
            <div className={styles.glow} aria-hidden="true" />
            <MatterCanvas
              texture="perle"
              priority
              staticOnLowEnd
              className={styles.matter}
              alt="Illustration 3D : une goutte de matière nacrée aux reflets turquoise"
              sizes="(max-width: 768px) 80vw, 40vw"
            />
          </div>
          <svg className={styles.ring} viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="hero-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
            </defs>
            <text>
              <textPath href="#hero-ring" startOffset="0">
                PARA-INSTITUT · PALM CLUB · ABIDJAN · PARA-INSTITUT · PALM CLUB · ABIDJAN ·
              </textPath>
            </text>
          </svg>
          <p className={styles.caption}>Matière &amp; lumière — illustration</p>
        </div>
      </div>

      <div className={`container ${styles.meta}`}>
        <span className={styles.scroll} aria-hidden="true">
          <span />
        </span>
        <p>{ESTABLISHMENT.address.value.line}</p>
        {phone ? (
          <a href={whatsappHref(phone.e164, "Bonjour Para Institut !")} target="_blank" rel="noopener noreferrer" className={styles.metaLink}>
            WhatsApp {phone.display}
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
