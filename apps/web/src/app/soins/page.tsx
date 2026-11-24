import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, Notice, buttonClass } from "@para/ui";
import { Poster } from "@/components/home/poster";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page/page-hero";
import { SERVICE_FAMILIES_CONTENT } from "@/content/services";
import styles from "./soins.module.css";

export const metadata: Metadata = {
  title: "Soins & bien-être",
  description: "Soins du visage, soins du corps, massages et spa à l'institut Para Institut du Palm Club, galerie marchande de l'Hôtel Palm Club, Abidjan.",
  alternates: { canonical: "/soins" },
};

export default function SoinsPage() {
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Institut de détente et de beauté"
        title={
          <>
            Soins &amp; <em>bien-être.</em>
          </>
        }
        lede="Quatre univers de soins, un même temps d'écoute. Les prestations détaillées, leurs durées et leurs tarifs seront présentés ici dès leur validation par l'institut."
        aside={
          <Link href="/soins/reservation" className={buttonClass("inverse", "lg", true)}>
            Demander un rendez-vous <ArrowIcon />
          </Link>
        }
      />
      <div className="container section">
        <Notice tone="info" title="Prestations en cours de saisie">
          Aucun protocole, aucune durée ni aucun tarif n&apos;est publié tant qu&apos;il n&apos;a pas été communiqué par l&apos;institut. Ils
          seront administrés depuis le back-office.
        </Notice>
        <div className={styles.families}>
          {SERVICE_FAMILIES_CONTENT.map((s, i) => (
            <Reveal as="section" key={s.family} id={s.family} className={styles.family} aria-labelledby={`f-${s.family}`}>
              <div className={styles.visual} data-flip={i % 2 === 1 || undefined}>
                <Poster texture={s.texture} alt="" className={styles.poster} />
              </div>
              <div className={styles.text}>
                <p className="eyebrow">{s.index}</p>
                <h2 id={`f-${s.family}`} className="h2">
                  {s.title}
                </h2>
                <p className="lede">{s.lede}</p>
                <dl className={styles.facts}>
                  <div>
                    <dt>Durée</dt>
                    <dd>Communiquée par l&apos;institut</dd>
                  </div>
                  <div>
                    <dt>Tarif</dt>
                    <dd>Communiqué par l&apos;institut</dd>
                  </div>
                </dl>
                <Link href={`/soins/reservation?famille=${s.family}`} className={buttonClass("secondary")}>
                  Demander ce soin <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
