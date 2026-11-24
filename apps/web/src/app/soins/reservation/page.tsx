import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { PageHero } from "@/components/page/page-hero";

export const metadata: Metadata = {
  title: "Demander un rendez-vous",
  description: "Demande de rendez-vous pour un soin à l'institut Para Institut du Palm Club, Abidjan. L'institut vous recontacte pour confirmer.",
  alternates: { canonical: "/soins/reservation" },
};

export default async function ReservationPage({ searchParams }: { searchParams: Promise<{ famille?: string }> }) {
  const { famille } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Réservation"
        title={
          <>
            Demander un <em>rendez-vous.</em>
          </>
        }
        lede="Trois étapes, sans compte. Une demande n'est pas un rendez-vous confirmé : l'institut vous recontacte pour fixer, reporter ou décliner le créneau."
      />
      <section className="section container" aria-label="Formulaire de demande">
        <BookingForm initialFamily={famille ?? null} />
      </section>
    </>
  );
}
