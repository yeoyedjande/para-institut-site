"use client";

import { Button } from "@para/ui";
import { PageHero } from "@/components/page/page-hero";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageHero
      eyebrow="Une erreur est survenue"
      title={
        <>
          Un instant, <em>s&apos;il vous plaît.</em>
        </>
      }
      lede="La page n'a pas pu s'afficher. Vous pouvez réessayer ; si le problème persiste, contactez-nous sur WhatsApp."
      aside={
        <Button size="lg" block onClick={reset}>
          Réessayer
        </Button>
      }
    />
  );
}
