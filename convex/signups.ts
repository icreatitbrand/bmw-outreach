import { mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { validateSignup } from "../src/lib/validation";

/**
 * Public signup mutation (PRD §8.2).
 *
 * 1. Honeypot check (silently succeeds).
 * 2. Server-side validation + E.164 phone normalization.
 * 3. Dedupe by email — duplicates return success, no new record.
 * 4. Insert, then schedule the welcome email action.
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.string(),
    businessName: v.optional(v.string()),
    businessStage: v.optional(v.string()),
    goals: v.optional(v.array(v.string())),
    goalsNote: v.optional(v.string()),
    consent: v.boolean(),
    website: v.optional(v.string()), // honeypot — must stay empty
    source: v.optional(v.string()), // UTM or referrer, if present
  },
  handler: async (ctx, args) => {
    // --- 1. Honeypot -----------------------------------------------
    if (args.website && args.website.trim().length > 0) {
      // Bot detected: pretend success, save nothing (PRD §12.6).
      return { ok: true as const, duplicate: false, honeypot: true };
    }

    // --- 2. Validate + normalize (never trust the client) ----------
    const { errors, normalized } = validateSignup({
      name: args.name,
      email: args.email,
      phone: args.phone,
      role: args.role,
      businessName: args.businessName,
      businessStage: args.businessStage,
      goals: args.goals,
      goalsNote: args.goalsNote,
      consent: args.consent,
      website: args.website,
    });

    if (!normalized) {
      // One clear, friendly message; inline field errors stay client-side.
      const first =
        errors.consent ??
        errors.phone ??
        errors.email ??
        errors.role ??
        errors.name ??
        Object.values(errors)[0] ??
        "Please check the form and try again.";
      return { ok: false as const, error: String(first) };
    }

    // --- 3. Dedupe by email (per-email rate limit) ------------------
    // A duplicate is treated as success: same modal, no second record.
    const existing = await ctx.db
      .query("signups")
      .withIndex("by_email", (q) => q.eq("email", normalized.email))
      .unique();

    if (existing) {
      return {
        ok: true as const,
        duplicate: true,
        firstName: existing.name.trim().split(/\s+/)[0],
      };
    }

    // --- 4. Insert, then schedule the welcome email -----------------
    const now = Date.now();
    await ctx.db.insert("signups", {
      ...normalized,
      consentAt: now,
      ...(args.source ? { source: args.source } : {}),
      emailStatus: "pending",
      emailAttempts: 0,
      createdAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendWelcome, {
      email: normalized.email,
    });

    return {
      ok: true as const,
      duplicate: false,
      firstName: normalized.name.trim().split(/\s+/)[0],
    };
  },
});

/** Internal: read a signup by email (used by the email action). */
export const getByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("signups")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

/** Internal: update emailStatus / attempts after each Brevo attempt. */
export const setEmailStatus = internalMutation({
  args: {
    email: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    attempts: v.number(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const signup = await ctx.db
      .query("signups")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!signup) return;
    await ctx.db.patch(signup._id, {
      emailStatus: args.status,
      emailAttempts: args.attempts,
      ...(args.error !== undefined ? { emailError: args.error } : {}),
    });
  },
});
