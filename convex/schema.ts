import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  signups: defineTable({
    name: v.string(),
    email: v.string(), // lowercase, deduped by index
    phone: v.string(), // E.164
    role: v.union(
      v.literal("student_entrepreneur"),
      v.literal("business_owner"),
      v.literal("professional"),
    ),
    businessName: v.optional(v.string()),
    businessStage: v.optional(
      v.union(v.literal("idea"), v.literal("early"), v.literal("established")),
    ),
    goals: v.optional(v.array(v.string())),
    goalsNote: v.optional(v.string()),
    consent: v.boolean(), // must be true
    consentAt: v.number(), // consent timestamp (PRD §9.5)
    source: v.optional(v.string()), // UTM or referrer, if present
    website: v.optional(v.string()), // honeypot echo (debugging only)
    emailStatus: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    emailAttempts: v.number(),
    emailError: v.optional(v.string()), // logged, visible in Convex dashboard
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"])
    .index("by_emailStatus", ["emailStatus"]),
});
