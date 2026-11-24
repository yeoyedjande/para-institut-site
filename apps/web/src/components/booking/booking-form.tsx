"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowIcon, Button, Field, Notice, controlClass } from "@para/ui";
import { PHONES, whatsappHref } from "@/content/establishment";
import { SERVICE_FAMILIES_CONTENT } from "@/content/services";
import { bookingMessage, validateBooking, type BookingDraft, type BookingErrors } from "./booking-request";
import styles from "./booking-form.module.css";

const STEPS = ["Soin", "Date", "Coordonnées"] as const;

function todayIso(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/**
 * Demande de rendez-vous (prototype). Le module de réservation avec disponibilités réelles arrive avec
 * l'API ; en attendant, la demande est transmise par la cliente elle-même via WhatsApp. Le site
 * n'enregistre rien et n'affiche jamais un rendez-vous comme confirmé.
 */
export function BookingForm({ initialFamily }: { initialFamily: string | null }) {
  const valid = SERVICE_FAMILIES_CONTENT.some((s) => s.family === initialFamily);
  const [draft, setDraft] = useState<BookingDraft>({
    family: valid ? (initialFamily as BookingDraft["family"]) : "",
    date: "",
    moment: "",
    firstName: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [ready, setReady] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const today = useMemo(() => todayIso(), []);

  const set = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setReady(null);
  };

  const stepFields: Array<Array<keyof BookingDraft>> = [["family"], ["date", "moment"], ["firstName", "phone", "message", "consent"]];

  const next = (event: React.FormEvent) => {
    event.preventDefault();
    const all = validateBooking(draft, today);
    const current = Object.fromEntries(stepFields[step]!.filter((k) => all[k]).map((k) => [k, all[k]])) as BookingErrors;
    setErrors(current);
    if (Object.keys(current).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [aria-describedby="family-error"]')?.focus());
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("legend")?.focus());
      return;
    }
    const title = SERVICE_FAMILIES_CONTENT.find((s) => s.family === draft.family)?.title ?? "";
    setReady(bookingMessage(draft, title));
  };

  return (
    <form ref={formRef} className={styles.form} onSubmit={next} noValidate>
      <ol className={styles.progress} aria-label="Étapes de la demande">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} data-done={i < step || undefined}>
            <span>{String(i + 1).padStart(2, "0")}</span> {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <fieldset className={styles.fieldset}>
          <legend tabIndex={-1} className={styles.legend}>
            Quel soin souhaitez-vous ?
          </legend>
          <div className={styles.options}>
            {SERVICE_FAMILIES_CONTENT.map((s) => (
              <label key={s.family} className={styles.option}>
                <input type="radio" name="family" value={s.family} checked={draft.family === s.family} onChange={() => set("family", s.family)} aria-describedby={errors.family ? "family-error" : undefined} />
                <span className={styles.optionTitle}>{s.title}</span>
                <span className={styles.optionText}>{s.lede}</span>
              </label>
            ))}
          </div>
          {errors.family ? (
            <p id="family-error" className={styles.error} role="alert">
              {errors.family}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset className={styles.fieldset}>
          <legend tabIndex={-1} className={styles.legend}>
            Quand souhaitez-vous venir ?
          </legend>
          <div className={styles.row}>
            <Field label="Date souhaitée" required error={errors.date} hint="L'institut vous proposera un créneau disponible.">
              <input type="date" className={controlClass} min={today} value={draft.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Moment de la journée" required error={errors.moment}>
              <select className={controlClass} value={draft.moment} onChange={(e) => set("moment", e.target.value as BookingDraft["moment"])}>
                <option value="">Choisir…</option>
                <option value="matin">Matin</option>
                <option value="apres-midi">Après-midi</option>
                <option value="indifferent">Indifférent</option>
              </select>
            </Field>
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className={styles.fieldset}>
          <legend tabIndex={-1} className={styles.legend}>
            Comment vous recontacter ?
          </legend>
          <div className={styles.row}>
            <Field label="Prénom" required error={errors.firstName}>
              <input className={controlClass} autoComplete="given-name" value={draft.firstName} onChange={(e) => set("firstName", e.target.value)} maxLength={60} />
            </Field>
            <Field label="Téléphone (WhatsApp)" required error={errors.phone} hint="Avec l'indicatif, par exemple +225.">
              <input className={controlClass} type="tel" inputMode="tel" autoComplete="tel" value={draft.phone} onChange={(e) => set("phone", e.target.value)} maxLength={24} />
            </Field>
          </div>
          <Field label="Précision (facultatif)" error={errors.message} hint="Ne mentionnez aucune information médicale.">
            <textarea className={controlClass} value={draft.message} onChange={(e) => set("message", e.target.value)} maxLength={500} />
          </Field>
          <label className={styles.consent}>
            <input type="checkbox" checked={draft.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={errors.consent ? true : undefined} />
            <span>J&apos;accepte d&apos;être recontacté(e) par l&apos;institut au sujet de cette demande.</span>
          </label>
          {errors.consent ? (
            <p className={styles.error} role="alert">
              {errors.consent}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className={styles.actions}>
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            Retour
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg">
          {step < STEPS.length - 1 ? "Continuer" : "Préparer ma demande"} <ArrowIcon />
        </Button>
      </div>

      {ready ? (
        <div className={styles.ready} role="status">
          <Notice tone="info" title="Votre demande est prête — elle n'est pas encore envoyée">
            Le module de réservation en ligne n&apos;est pas encore actif. Envoyez ce message à l&apos;institut sur WhatsApp : l&apos;équipe vous
            répondra pour confirmer, proposer ou refuser un créneau. Tant que vous n&apos;avez pas reçu de confirmation, il ne s&apos;agit pas
            d&apos;un rendez-vous.
          </Notice>
          <pre className={styles.preview}>{ready}</pre>
          <div className={styles.send}>
            {PHONES.map((p) => (
              <a key={p.e164} className={styles.sendLink} href={whatsappHref(p.e164, ready)} target="_blank" rel="noopener noreferrer">
                Envoyer au {p.display}
                <span className="sr-only"> sur WhatsApp (nouvel onglet)</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
