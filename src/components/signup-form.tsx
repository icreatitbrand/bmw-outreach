"use client";

import { useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BUSINESS_STAGES,
  GOALS,
  ROLES,
  WHATSAPP_INVITE_URL,
} from "@/lib/site";
import {
  firstNameOf,
  validateSignup,
  type FieldErrors,
} from "@/lib/validation";
import { ThankYouModal } from "./thank-you-modal";

/**
 * Sign-up form (PRD §5): client-side validation with friendly inline
 * errors, honeypot, loading state, and the thank-you modal on success.
 * The Convex mutation repeats every rule server-side.
 */

interface FormValues {
  name: string;
  email: string;
  phone: string;
  role: string;
  businessName: string;
  businessStage: string;
  goals: string[];
  goalsNote: string;
  consent: boolean;
  website: string; // honeypot
}

const EMPTY: FormValues = {
  name: "",
  email: "",
  phone: "",
  role: "",
  businessName: "",
  businessStage: "",
  goals: [],
  goalsNote: "",
  consent: false,
  website: "",
};

type SubmitResult =
  | { ok: true; duplicate: boolean; firstName?: string }
  | { ok: false; error: string };

function captureSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const utm = ["utm_source", "utm_medium", "utm_campaign"]
    .map((k) => params.get(k))
    .filter(Boolean)
    .join("|");
  if (utm) return utm.slice(0, 200);
  return document.referrer ? document.referrer.slice(0, 200) : undefined;
}

const fieldClass =
  "h-12 w-full rounded border border-line bg-white px-4 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none";

const errorClass = "mt-1.5 text-sm text-red-700";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={errorClass}>
      {message}
    </p>
  );
}

export function SignupForm() {
  const convex = useConvex();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function clientValidate(): boolean {
    const { errors } = validateSignup({ ...values });
    // The honeypot check runs server-side; ignore that entry here.
    delete (errors as Record<string, unknown>).website;
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return false;
    }
    return true;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    if (!clientValidate()) return;

    if (!convex) {
      setServerError(
        "Sign-ups aren't connected yet. The site owner needs to link the backend (Convex) first.",
      );
      return;
    }

    setStatus("submitting");
    try {
      const result: SubmitResult = await convex.mutation(api.signups.create, {
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        phone: values.phone.trim(),
        role: values.role,
        businessName: values.businessName.trim() || undefined,
        businessStage: values.businessStage || undefined,
        goals: values.goals.length ? values.goals : undefined,
        goalsNote: values.goalsNote.trim() || undefined,
        consent: values.consent,
        website: values.website || undefined,
        source: captureSource(),
      });

      if (result.ok) {
        setFirstName(result.firstName || firstNameOf(values.name));
        setStatus("done");
        setValues(EMPTY);
        setErrors({});
        setModalOpen(true);
      } else {
        setStatus("idle");
        setServerError(result.error);
      }
    } catch {
      // Keep entered data; let the user retry (PRD §5.2).
      setStatus("idle");
      setServerError(
        "Something went wrong on our side. Your details are still here — please try again.",
      );
    }
  }

  const chipBase =
    "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition";

  return (
    <section
      id="signup"
      aria-labelledby="signup-heading"
      className="bg-ivory px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-xl">
        <div id="signup-heading" className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Join us for free
          </p>
          <h2 className="wordmark-rule mt-2 text-2xl text-ink sm:text-3xl">
            Sign Up for the Outreach
          </h2>
          <p className="mt-3 text-muted">
            Takes under two minutes. You&apos;ll get the WhatsApp group invite
            right away.
          </p>
        </div>

        {serverError ? (
          <div
            role="alert"
            className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {serverError}
          </div>
        ) : null}

        <form
          noValidate
          onSubmit={onSubmit}
          className="mt-8 rounded-xl border border-line bg-white p-6 shadow-card sm:p-8"
        >
          {/* Full name */}
          <div>
            <label htmlFor="field-name" className="mb-1.5 block text-sm font-semibold text-ink">
              Full name <span aria-hidden="true">*</span>
            </label>
            <input
              id="field-name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              className={`${fieldClass} ${errors.name ? "border-red-400" : ""}`}
              placeholder="e.g. Chidi Okonkwo"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-describedby={errors.name ? "error-name" : undefined}
              aria-invalid={Boolean(errors.name)}
            />
            <ErrorText id="error-name" message={errors.name} />
          </div>

          {/* Email */}
          <div className="mt-5">
            <label htmlFor="field-email" className="mb-1.5 block text-sm font-semibold text-ink">
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              id="field-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${fieldClass} ${errors.email ? "border-red-400" : ""}`}
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-describedby={errors.email ? "error-email" : undefined}
              aria-invalid={Boolean(errors.email)}
            />
            <ErrorText id="error-email" message={errors.email} />
          </div>

          {/* WhatsApp number */}
          <div className="mt-5">
            <label htmlFor="field-phone" className="mb-1.5 block text-sm font-semibold text-ink">
              WhatsApp number <span aria-hidden="true">*</span>
            </label>
            <input
              id="field-phone"
              name="phone"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              className={`${fieldClass} ${errors.phone ? "border-red-400" : ""}`}
              placeholder="0801 234 5678 or +234 801 234 5678"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-describedby={errors.phone ? "error-phone" : "hint-phone"}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <ErrorText id="error-phone" message={errors.phone} />
            ) : (
              <p id="hint-phone" className="mt-1.5 text-xs text-muted">
                Accepts Nigerian and international numbers.
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mt-5">
            <label htmlFor="field-role" className="mb-1.5 block text-sm font-semibold text-ink">
              I am a… <span aria-hidden="true">*</span>
            </label>
            <select
              id="field-role"
              name="role"
              required
              className={`${fieldClass} ${errors.role ? "border-red-400" : ""}`}
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              aria-describedby={errors.role ? "error-role" : undefined}
              aria-invalid={Boolean(errors.role)}
            >
              <option value="" disabled>
                Choose one…
              </option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ErrorText id="error-role" message={errors.role} />
          </div>

          {/* Business name (optional) */}
          <div className="mt-5">
            <label htmlFor="field-businessName" className="mb-1.5 block text-sm font-semibold text-ink">
              Business name{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="field-businessName"
              name="businessName"
              type="text"
              maxLength={100}
              autoComplete="organization"
              className={fieldClass}
              placeholder="Your business, venture, or brand"
              value={values.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              aria-describedby={errors.businessName ? "error-businessName" : undefined}
            />
            <ErrorText id="error-businessName" message={errors.businessName} />
          </div>

          {/* Business stage (optional) */}
          <div className="mt-5">
            <label htmlFor="field-businessStage" className="mb-1.5 block text-sm font-semibold text-ink">
              Business stage{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <select
              id="field-businessStage"
              name="businessStage"
              className={fieldClass}
              value={values.businessStage}
              onChange={(e) => set("businessStage", e.target.value)}
            >
              <option value="">Select a stage…</option>
              {BUSINESS_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ErrorText id="error-businessStage" message={errors.businessStage} />
          </div>

          {/* Goals — multi-select chips */}
          <fieldset className="mt-5">
            <legend className="mb-1.5 text-sm font-semibold text-ink">
              What are you hoping to gain?{" "}
              <span className="font-normal text-muted">(optional)</span>
            </legend>
            <div className="flex flex-wrap gap-2 pt-1">
              {GOALS.map((goal) => {
                const selected = values.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      set(
                        "goals",
                        selected
                          ? values.goals.filter((g) => g !== goal)
                          : [...values.goals, goal],
                      )
                    }
                    className={`${chipBase} ${
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-line bg-white text-muted hover:border-primary/40 hover:text-ink"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
            {errors.goals ? <ErrorText id="error-goals" message={errors.goals} /> : null}

            {/* Optional short note */}
            <div className="mt-3">
              <label htmlFor="field-goalsNote" className="sr-only">
                Anything else? (optional, up to 300 characters)
              </label>
              <textarea
                id="field-goalsNote"
                name="goalsNote"
                maxLength={300}
                rows={3}
                className="w-full rounded border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                placeholder="Anything else you'd like us to know? (optional)"
                value={values.goalsNote}
                onChange={(e) => set("goalsNote", e.target.value)}
              />
              <p className="mt-1 text-right text-xs text-muted">
                {values.goalsNote.length}/300
              </p>
              {errors.goalsNote ? (
                <ErrorText id="error-goalsNote" message={errors.goalsNote} />
              ) : null}
            </div>
          </fieldset>

          {/* Honeypot — visually and programmatically hidden */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="field-website">Website</label>
            <input
              id="field-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>

          {/* Consent */}
          <div className="mt-6">
            <div className="flex items-start gap-3">
              <input
                id="field-consent"
                name="consent"
                type="checkbox"
                required
                checked={values.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-describedby={errors.consent ? "error-consent" : undefined}
                aria-invalid={Boolean(errors.consent)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
              />
              <label htmlFor="field-consent" className="text-sm leading-relaxed text-ink">
                I agree to be contacted by BMW Outreach about this fellowship.{" "}
                <a
                  href="#privacy"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  Privacy note
                </a>
                .
              </label>
            </div>
            {errors.consent ? (
              <ErrorText id="error-consent" message={errors.consent} />
            ) : null}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded bg-primary px-6 text-base font-semibold text-white shadow-card transition hover:bg-primary-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted"
          >
            {status === "submitting" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeOpacity="0.25"
                    strokeWidth="3"
                  />
                  <path
                    d="M22 12a10 10 0 0 0-10-10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Signing you up…
              </>
            ) : (
              "Join the Outreach"
            )}
          </button>
          <p aria-live="polite" className="sr-only">
            {status === "submitting" ? "Submitting your details" : ""}
          </p>
        </form>
      </div>

      <ThankYouModal
        open={modalOpen}
        firstName={firstName}
        whatsappUrl={WHATSAPP_INVITE_URL}
        onClose={() => {
          setModalOpen(false);
          setStatus("idle");
        }}
      />
    </section>
  );
}
