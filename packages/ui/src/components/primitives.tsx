import { type ButtonHTMLAttributes, type ReactNode, useId, cloneElement, isValidElement } from "react";
import { STATUS_LABELS, type SourceStatus } from "@para/contracts";
import s from "./ui.module.css";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ Button */
export type ButtonVariant = "primary" | "secondary" | "inverse" | "ghostInverse" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", block = false): string {
  return cx(s.btn, s[variant], size !== "md" && s[size], block && s.block);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

export function Button({ variant = "primary", size = "md", block, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cx(buttonClass(variant, size, block), className)} {...rest} />;
}

/** Flèche fine utilisée dans les appels à l'action. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cx(s.btnIcon, className)} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------- Badge */
export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "error" | "demo";

export function Badge({ tone = "neutral", dot, children, className }: { tone?: BadgeTone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cx(s.badge, s[tone], className)}>
      {dot ? <span className={s.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const STATUS_TONES: Record<SourceStatus, BadgeTone> = {
  VERIFIED: "success",
  HISTORICAL: "neutral",
  TO_CONFIRM: "warning",
  DEMO_ONLY: "demo",
};

/** Signale la provenance d'une information (affiché uniquement hors production). */
export function ProvenanceBadge({ status, className }: { status: SourceStatus; className?: string }) {
  return (
    <Badge tone={STATUS_TONES[status]} className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

/* ------------------------------------------------------------------- Field */
export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Un unique élément de formulaire ; reçoit id, aria-describedby et aria-invalid. */
  children: ReactNode;
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement<Record<string, unknown>>(children)
    ? cloneElement(children, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })
    : children;
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={s.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {control}
      {hint ? (
        <p className={s.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={s.errorText} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Classe commune des champs (input, select, textarea). */
export const controlClass = s.control;

/* ------------------------------------------------------------------ Notice */
export type NoticeTone = "info" | "success" | "warning" | "error";

const NOTICE_PATHS: Record<NoticeTone, string> = {
  info: "M10 9v5M10 6.2v.1M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
  success: "m6.5 10.2 2.4 2.4 4.6-5M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
  warning: "M10 7.5v4M10 14.2v.1M8.6 3.3 2.2 14.6A1.6 1.6 0 0 0 3.6 17h12.8a1.6 1.6 0 0 0 1.4-2.4L11.4 3.3a1.6 1.6 0 0 0-2.8 0Z",
  error: "m7.5 7.5 5 5m0-5-5 5M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
};

export function Notice({ tone = "info", title, children, className }: { tone?: NoticeTone; title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx(s.notice, s[tone], className)} role={tone === "error" ? "alert" : "note"}>
      <svg className={s.noticeIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d={NOTICE_PATHS[tone]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        {title ? <p className={s.noticeTitle}>{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------- Skeleton & Spinner */
export function Skeleton({ width = "100%", height = "1rem", className }: { width?: string; height?: string; className?: string }) {
  return <span className={cx(s.skeleton, className)} style={{ width, height }} aria-hidden="true" />;
}

export function Spinner({ label = "Chargement" }: { label?: string }) {
  return (
    <span role="status" aria-live="polite">
      <span className={s.spinner} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------- EmptyState */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className={s.empty}>
      <svg className={s.emptyMark} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 6c6 8 6 28 0 36M24 6c-6 8-6 28 0 36M8 24h32" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <p className={s.emptyTitle}>{title}</p>
      {children ? <div className={s.emptyText}>{children}</div> : null}
      {action}
    </div>
  );
}
