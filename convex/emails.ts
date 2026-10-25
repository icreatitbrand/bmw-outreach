import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { firstNameOf } from "../src/lib/validation";

const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [60_000, 300_000, 900_000]; // 1 min, 5 min, 15 min

interface BrevoError {
  message?: string;
}

interface SignupRowLike {
  name: string;
  role: string;
  emailStatus: string;
  emailAttempts: number;
}

/**
 * Welcome email via the Brevo transactional API (PRD §7).
 *
 * Scheduled from the signup mutation so the UI is never blocked.
 * Retries up to 3 attempts with backoff. `emailStatus` tracks
 * pending / sent / failed; failures are logged on the record and
 * visible in the Convex dashboard.
 *
 * Required Convex env vars:
 *   BREVO_API_KEY, EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME,
 *   EMAIL_REPLY_TO, WHATSAPP_INVITE_URL
 */
export const sendWelcome = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.BREVO_API_KEY;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS;
    const fromName = process.env.EMAIL_FROM_NAME ?? "BMW Outreach";
    const replyTo = process.env.EMAIL_REPLY_TO ?? fromAddress;
    const whatsappUrl = process.env.WHATSAPP_INVITE_URL;

    const signup: SignupRowLike | null = await ctx.runQuery(
      internal.signups.getByEmail,
      { email: args.email },
    );
    if (!signup || signup.emailStatus === "sent") return;

    // Fail fast (and permanently) when email is not configured yet.
    if (!apiKey || !fromAddress) {
      console.error("[emails] BREVO_API_KEY / EMAIL_FROM_ADDRESS not set");
      await ctx.runMutation(internal.signups.setEmailStatus, {
        email: args.email,
        status: "failed",
        attempts: MAX_ATTEMPTS,
        error: "Email provider not configured",
      });
      return;
    }

    const attempt = signup.emailAttempts + 1;
    const firstName = firstNameOf(signup.name);

    const html = renderWelcomeHtml({ firstName, role: signup.role, whatsappUrl });
    const text = renderWelcomeText({ firstName, role: signup.role, whatsappUrl });

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: fromName, email: fromAddress },
          to: [{ email: args.email, name: signup.name }],
          ...(replyTo ? { replyTo: { email: replyTo } } : {}),
          subject: `Welcome to BMW Outreach, ${firstName}`,
          htmlContent: html,
          textContent: text,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as BrevoError;
        throw new Error(`Brevo ${res.status}: ${body.message ?? res.statusText}`);
      }

      await ctx.runMutation(internal.signups.setEmailStatus, {
        email: args.email,
        status: "sent",
        attempts: attempt,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[emails] attempt ${attempt} failed: ${message}`);

      if (attempt < MAX_ATTEMPTS) {
        // Keep status pending, log the error, and retry after backoff.
        await ctx.runMutation(internal.signups.setEmailStatus, {
          email: args.email,
          status: "pending",
          attempts: attempt,
          error: message,
        });
        await ctx.scheduler.runAfter(
          BACKOFF_MS[attempt - 1] ?? 300_000,
          internal.emails.sendWelcome,
          { email: args.email },
        );
      } else {
        await ctx.runMutation(internal.signups.setEmailStatus, {
          email: args.email,
          status: "failed",
          attempts: attempt,
          error: message,
        });
      }
    }
  },
});

/** One personalized line based on the "I am a…" selection (PRD §7.5). */
function personalizedLine(role: string): string {
  switch (role) {
    case "student_entrepreneur":
      return "Your ideas deserve guidance and a community that believes in what you're building.";
    case "business_owner":
      return "Running a business is demanding. You don't have to carry it alone.";
    default:
      return "Your work is a platform for purpose, and we'd love to walk alongside you.";
  }
}

/** Plain, lightweight HTML in Pastor Wisdom's voice (PRD §7.4). */
function renderWelcomeHtml(opts: {
  firstName: string;
  role: string;
  whatsappUrl?: string;
}): string {
  const { firstName, role, whatsappUrl } = opts;
  const button = whatsappUrl
    ? `<p style="margin:24px 0"><a href="${whatsappUrl}" style="background:#0B3D2E;color:#ffffff;padding:14px 28px;border-radius:4px;text-decoration:none;font-weight:600">Join the WhatsApp Group</a></p>`
    : "";
  return `<!doctype html>
<html>
  <body style="margin:0;background:#FAF7F0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#10201A">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E5DFD3;border-radius:8px;padding:32px 24px">
      <p style="font-size:12px;letter-spacing:2px;color:#C9A24B;text-transform:uppercase;margin:0 0 8px">Businessmen &amp; Women Outreach</p>
      <h1 style="color:#0B3D2E;margin:0 0 16px">Welcome, ${firstName}.</h1>
      <p>Hi ${firstName},</p>
      <p>Welcome to Businessmen &amp; Women Outreach. We are glad you are here.</p>
      <p><em>${personalizedLine(role)}</em></p>
      <p>Your next step is to join our WhatsApp group. That is where we share meeting details, links, and updates.</p>
      ${button}
      <p>We are starting online, with in-person meetings to follow. Everything is free, and you will find all the details in the group.</p>
      <p>Remember: <strong>God is your business partner.</strong></p>
      <p style="margin-top:24px">Warmly,<br/><strong>Pastor Wisdom Ifeanyi</strong><br/><span style="color:#5B6B64">Coordinator, BMW Outreach</span></p>
      <hr style="border:none;border-top:1px solid #E5DFD3;margin:24px 0"/>
      <p style="color:#5B6B64;font-size:12px">You received this email because you signed up on the BMW Outreach landing page. Questions? Simply reply to this email. If you no longer wish to hear from us, reply with &ldquo;Unsubscribe&rdquo;.</p>
    </div>
  </body>
</html>`;
}

function renderWelcomeText(opts: {
  firstName: string;
  role: string;
  whatsappUrl?: string;
}): string {
  const { firstName, role, whatsappUrl } = opts;
  return [
    `Hi ${firstName},`,
    "",
    "Welcome to Businessmen & Women Outreach. We are glad you are here.",
    "",
    personalizedLine(role),
    "",
    "Your next step is to join our WhatsApp group. That is where we share meeting details, links, and updates:",
    whatsappUrl ?? "(WhatsApp invite link coming soon)",
    "",
    "We are starting online, with in-person meetings to follow. Everything is free.",
    "",
    "Remember: God is your business partner.",
    "",
    "Warmly,",
    "Pastor Wisdom Ifeanyi",
    "Coordinator, BMW Outreach",
    "",
    'You are receiving this email because you signed up via our landing page. Reply "Unsubscribe" to stop receiving these emails.',
  ].join("\n");
}
