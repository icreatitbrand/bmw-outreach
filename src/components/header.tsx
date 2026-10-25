import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Sticky header (PRD §4.1): text wordmark left, compact "Join Free" CTA
 * right. Anchor links collapse to the CTA only on mobile.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-black/90 text-white backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#top"
          className="flex min-h-11 flex-col justify-center leading-none"
          aria-label={`${SITE.name} — home`}
        >
          <span className="wordmark-rule text-2xl text-gold">BMW</span>
          <span className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-white/55 sm:block">
            Businessmen &amp; Women Outreach
          </span>
        </Link>
        <a
          href="#signup"
          className="inline-flex h-11 items-center gap-2 rounded bg-gold px-4 text-sm font-semibold text-black shadow-gold transition hover:bg-gold-soft"
        >
          Join Free
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 2v9M4.5 7.5 8 11l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 14h10"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <span className="sr-only">— scrolls to the sign-up form</span>
        </a>
      </div>
    </header>
  );
}
