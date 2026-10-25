# BMW Outreach — Landing Page

Single-page, mobile-first landing website for **Businessmen & Women Outreach (BMW Outreach)** — a free Christian fellowship for student entrepreneurs, business owners, and professionals.

**Tagline:** “God is your business partner.”

Built from `../Docs/BMW-Outreach-PRD.md`, with the Stitch design (`../bmw_stitch_design/`) used as visual reference.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 with design tokens (`src/app/globals.css`) |
| Backend / DB | Convex (`convex/`) |
| Email | Brevo transactional API (Convex action) |
| Hosting | Vercel (frontend) + Convex Cloud (backend) |

## Page sections (PRD §4)

Header (sticky, “Join Free”) → Hero → Who It’s For → Intro Video (lazy, `youtube-nocookie`) → A Word from the Coordinator → How It Works → Sign-Up Form → Footer (with privacy note).

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

### 1. Convex backend

```bash
npx convex dev
```

The first run replaces the hand-written stubs in `convex/_generated/` with real typed codegen, pushes the schema, and prints `NEXT_PUBLIC_CONVEX_URL`. Put it in `.env.local`.

> **Note:** `convex/_generated/` currently contains hand-written placeholders so `npm run build` works before a deployment exists. `npx convex dev` regenerates everything.

### 2. Environment variables

Copy `.env.example`:

- **`.env.local` / Vercel** — `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_WHATSAPP_INVITE_URL`, `NEXT_PUBLIC_YOUTUBE_VIDEO_ID`, `NEXT_PUBLIC_SITE_URL`
- **Convex env (server-side, set with `npx convex env set`)** — `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`, `WHATSAPP_INVITE_URL`

Keep the two WhatsApp URLs in sync (the mutation returns the link flow relies on the modal one; emails use the Convex one).

### 3. Email (Brevo)

The `emails.sendWelcome` action posts to `https://api.brevo.com/v3/smtp/email`, scheduled from the signup mutation (“pending” → “sent”/“failed”, up to 3 attempts with backoff). Verify the sending domain (SPF/DKIM/DMARC) before launch.

## Form behavior

- Client-side inline validation; **the Convex mutation repeats every rule server-side**.
- Phone numbers normalized to **E.164** (default country **+234**): `080…`, `234…`, and `+234…` all accepted.
- **Honeypot** `website` field — must stay empty; bots get a fake success with no record.
- **Duplicate email = success** (same modal, no second record).
- Consent checkbox required; consent timestamp stored.

## Placeholder inputs still needed (PRD §13 / Appendix C)

- Pastor Wisdom’s photo + approved message (photo area is a styled “PW” placeholder)
- WhatsApp group invite link (`NEXT_PUBLIC_WHATSAPP_INVITE_URL`)
- Intro video ID (`NEXT_PUBLIC_YOUTUBE_VIDEO_ID`) — a tasteful placeholder shows until then
- Confirmed sender/reply-to addresses, Brevo API key, DNS access, final privacy wording

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Type-check + production build |
| `npm start` | Serve the production build |
| `npx convex dev` | Local Convex sync + codegen |

## Deployment (PRD §11)

1. Push to GitHub; deploy to Vercel (frontend).
2. `npx convex deploy` for the prod backend; run `npx convex env set` for server vars.
3. Set Vercel env vars; verify the OG preview in WhatsApp `/opengraph-image` is auto-generated.
4. End-to-end test: form → modal → WhatsApp link → welcome email in a real inbox.
