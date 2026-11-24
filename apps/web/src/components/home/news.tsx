import Image from "next/image";
import Link from "next/link";
import { isCurrent, publishable } from "@para/contracts";
import { ArrowIcon, Badge, ProvenanceBadge, buttonClass } from "@para/ui";
import { Reveal } from "@/components/motion/reveal";
import { NEWS, NEWS_KIND_LABELS } from "@/content/news";
import { CONTENT_MODE, IS_DEMO } from "@/lib/content-mode";
import styles from "./news.module.css";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Abidjan" });

export function formatRange(startsAt: string, endsAt: string | null): string {
  const start = dateFormat.format(new Date(startsAt));
  if (!endsAt) return start;
  const end = dateFormat.format(new Date(endsAt));
  return start === end ? start : `Du ${start} au ${end}`;
}

/** Section 09 — Actualités et événements. Un contenu terminé n'est jamais présenté comme actuel. */
export function News({ now = new Date() }: { now?: Date }) {
  const items = publishable(NEWS, CONTENT_MODE).filter((n) => isCurrent(n, now));
  const [featured, ...others] = items;
  return (
    <section className={`section ${styles.section}`} aria-labelledby="news-title" data-mood="ivory">
      <div className={`container ${styles.head}`}>
        <Reveal className={styles.headText}>
          <p className="eyebrow">09 — Actualités &amp; événements</p>
          <h2 id="news-title" className="h2">
            À <em className={styles.em}>l&apos;agenda.</em>
          </h2>
        </Reveal>
        <Link href="/actualites" className={buttonClass("secondary")}>
          Toutes les actualités <ArrowIcon />
        </Link>
      </div>

      <div className={`container ${styles.grid}`}>
        {featured ? (
          <Reveal as="article" className={styles.featured} aria-labelledby={`n-${featured.id}`}>
            {featured.image ? (
              <div className={styles.featuredMedia}>
                <Image src={featured.image.src} alt={featured.image.alt} width={833} height={400} sizes="(max-width: 900px) 100vw, 55vw" className={styles.img} />
                <span className={styles.mediaNote}>Visuel de campagne</span>
              </div>
            ) : null}
            <div className={styles.featuredBody}>
              <div className={styles.meta}>
                <Badge tone="brand">{NEWS_KIND_LABELS[featured.kind]}</Badge>
                {IS_DEMO ? <ProvenanceBadge status={featured.status} /> : null}
              </div>
              <p className={styles.date}>{formatRange(featured.startsAt, featured.endsAt)}</p>
              <h3 id={`n-${featured.id}`} className={styles.featuredTitle}>
                {featured.title}
              </h3>
              <p className={styles.excerpt}>{featured.excerpt}</p>
              {featured.href ? (
                <a href={featured.href} className={buttonClass("primary")} target="_blank" rel="noopener noreferrer">
                  Voir l&apos;événement <ArrowIcon />
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <p className={styles.empty}>Aucune actualité en cours. Les prochaines animations seront annoncées ici.</p>
        )}

        {others.length ? (
          <ul role="list" className={styles.list}>
            {others.map((n, i) => (
              <Reveal as="li" key={n.id} delay={i * 100} className={styles.item}>
                <div className={styles.meta}>
                  <Badge>{NEWS_KIND_LABELS[n.kind]}</Badge>
                  {IS_DEMO ? <ProvenanceBadge status={n.status} /> : null}
                </div>
                <h3 className={styles.itemTitle}>{n.title}</h3>
                <p className={styles.excerpt}>{n.excerpt}</p>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
