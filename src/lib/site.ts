/** Site-wide constants for BMW Outreach (Businessmen & Women Outreach). */

export const SITE = {
  name: "Businessmen & Women Outreach",
  shortName: "BMW Outreach",
  tagline: "God is your business partner.",
  contactEmail: "outreach@icreatitbrandagency.com",
  coordinator: "Pastor Wisdom Ifeanyi",
  coordinatorTitle: "Coordinator, BMW Outreach",
  builtBy: "iCreatIt Brand Agency",
};

/** Client-side WhatsApp invite link (also set in Convex for the email). */
export const WHATSAPP_INVITE_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_INVITE_URL ?? "";

/** Intro video — placeholder until the recording is ready (PRD §4.4). */
export const YOUTUBE_VIDEO_ID =
  process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID ?? "";

/** Canonical site URL, used for SEO/OG metadata. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const ROLES = [
  { value: "student_entrepreneur", label: "Student Entrepreneur" },
  { value: "business_owner", label: "Business Owner" },
  { value: "professional", label: "Professional" },
] as const;

export const BUSINESS_STAGES = [
  { value: "idea", label: "Just an idea" },
  { value: "early", label: "Early stage" },
  { value: "established", label: "Established" },
] as const;

export const GOALS = [
  "Mentorship",
  "Networking",
  "Spiritual growth",
  "Accountability",
  "Business guidance",
] as const;

export type Role = (typeof ROLES)[number]["value"];
export type BusinessStage = (typeof BUSINESS_STAGES)[number]["value"];

export function roleLabel(role: string): string {
  return ROLES.find((r) => r.value === role)?.label ?? role;
}

export function stageLabel(stage: string): string {
  return BUSINESS_STAGES.find((s) => s.value === stage)?.label ?? stage;
}
