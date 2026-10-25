import { SITE } from "@/lib/site";

/**
 * Footer (PRD §4.8): black & gold treatment — wordmark + tagline, contact
 * email, privacy note (expandable), agency credit, and copyright.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="privacy"
      className="border-t border-gold/25 bg-black px-4 pb-10 pt-12 text-white sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="wordmark-rule text-2xl text-gold">BMW</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
            Businessmen &amp; Women Outreach
          </p>
          <p className="wordmark-rule mt-2 text-lg text-gold-soft">
            {SITE.tagline}
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="min-h-11 text-sm text-white/70 underline underline-offset-2 transition hover:text-gold"
          >
            {SITE.contactEmail}
          </a>
        </div>

        <details className="mx-auto mt-8 max-w-xl rounded-lg border border-white/12 bg-white/5 p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-gold">
            Privacy note
            <span className="sr-only"> — opens a short summary</span>
          </summary>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
            <p>
              When you sign up we collect your name, email, WhatsApp number,
              role, business details, and goals. We use this only to welcome
              you, manage the fellowship, and contact you about meetings.
            </p>
            <p>
              Access is limited to authorized BMW Outreach team members. You
              may ask what we hold about you, request corrections, or request
              deletion at any time by emailing{" "}
              <a
                className="text-gold underline"
                href={`mailto:${SITE.contactEmail}`}
              >
                {SITE.contactEmail}
              </a>
              . We handle your data in line with the Nigeria Data Protection
              Act (NDPA).
            </p>
          </div>
        </details>

        <div className="mt-8 text-center text-xs text-white/50">
          <p>Built by {SITE.builtBy}.</p>
          <p className="mt-1">
            © {year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
