import type { BusinessStage, Role } from "./site";

/**
 * Shared signup validation rules.
 *
 * Used by BOTH the client (friendly inline errors) and the Convex mutation
 * (the server repeats every rule — the client is never trusted, PRD §5.2).
 */

export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  role: string;
  businessName?: string;
  businessStage?: string;
  goals?: string[];
  goalsNote?: string;
  consent: boolean;
  website?: string; // honeypot
}

export interface NormalizedSignup {
  name: string;
  email: string;
  phone: string; // E.164
  role: Role;
  businessName?: string;
  businessStage?: BusinessStage;
  goals?: string[];
  goalsNote?: string;
  consent: boolean;
}

export type FieldErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "role"
    | "businessName"
    | "businessStage"
    | "goals"
    | "goalsNote"
    | "consent",
    string
  >
>;

const GOALS_ALLOWED = new Set([
  "Mentorship",
  "Networking",
  "Spiritual growth",
  "Accountability",
  "Business guidance",
]);

const ROLES = new Set(["student_entrepreneur", "business_owner", "professional"]);
const STAGES = new Set(["idea", "early", "established"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Simple, pragmatic E.164 normalization (default country: Nigeria, +234). */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/[^\d+]/g, "");
  // Reject multiple "+" signs (e.g. "++234..." typed by hand).
  if ((digits.match(/\+/g)?.length ?? 0) > 1) return null;

  const hadPlus = digits.startsWith("+");
  digits = digits.replace(/\+/g, "");

  if (!/^\d{7,15}$/.test(digits)) return null;

  if (hadPlus) return `+${digits}`; // explicit international format
  if (digits.startsWith("234")) return `+${digits}`; // 234 without +
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`; // local 080...
  // 7–10 digits with no prefix: treat as local Nigerian number.
  if (digits.length <= 10) return `+234${digits}`;
  return `+${digits}`;
}

export function validateSignup(
  input: SignupInput,
): { errors: FieldErrors; normalized: NormalizedSignup | null } {
  const errors: FieldErrors = {};

  // ---- Honeypot: must stay empty (checked again server-side) ----
  if (input.website && input.website.trim().length > 0) {
    // Pretend success; the mutation drops the record silently.
    return { errors: {}, normalized: null };
  }

  // ---- Name: 2–80 characters ----
  const name = input.name?.trim() ?? "";
  if (name.length < 2 || name.length > 80) {
    errors.name = "Please enter your full name (2–80 characters).";
  }

  // ---- Email: format + lowercase normalization ----
  const email = (input.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = "Please enter a valid email address.";
  }

  // ---- Phone: normalizes to E.164 ----
  const phone = normalizePhone(input.phone ?? "");
  if (!phone) {
    errors.phone =
      "Please enter a valid WhatsApp number, e.g. 0801 234 5678 or +234 801 234 5678.";
  }

  // ---- Role: required ----
  const role = (input.role ?? "").trim();
  if (!ROLES.has(role)) {
    errors.role = "Please choose what best describes you.";
  }

  // ---- Optional fields ----
  const businessName = (input.businessName ?? "").trim();
  if (businessName.length > 100) {
    errors.businessName = "Business name is limited to 100 characters.";
  }

  const businessStage = (input.businessStage ?? "").trim();
  if (businessStage && !STAGES.has(businessStage)) {
    errors.businessStage = "Please choose a valid business stage.";
  }

  const goals = (input.goals ?? []).filter((g) => GOALS_ALLOWED.has(g));
  if ((input.goals ?? []).length > goals.length) {
    errors.goals = "Some selected options are not recognised.";
  }

  const goalsNote = (input.goalsNote ?? "").trim();
  if (goalsNote.length > 300) {
    errors.goalsNote = "Please keep this note under 300 characters.";
  }

  // ---- Consent: required ----
  if (input.consent !== true) {
    errors.consent = "Please agree to be contacted about the fellowship.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, normalized: null };
  }

  const normalized: NormalizedSignup = {
    name,
    email,
    phone: phone!,
    role: role as Role,
    ...(businessName ? { businessName } : {}),
    ...(businessStage ? { businessStage: businessStage as BusinessStage } : {}),
    ...(goals.length ? { goals } : {}),
    ...(goalsNote ? { goalsNote } : {}),
    consent: true,
  };

  return { errors: {}, normalized };
}

/** First name from a full name, for modal/email greeting. */
export function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}
