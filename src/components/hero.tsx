"use client";

import { useEffect, useState } from "react";

/**
 * Hero (PRD §4.2) — black & gold luxury treatment with an auto-rotating
 * image slider. Slides are styled placeholders until the client supplies
 * photography; swap the `background` on each slide for a real image.
 * Transitions: crossfade + slow ken-burns zoom every 6 seconds.
 */

const SLIDE_MS = 6000;

interface Slide {
  /** Replace `background` with `url(/images/your-photo.jpg) center/cover` */
  background: string;
  caption: string;
}

const SLIDES: Slide[] = [
  {
    background:
      "linear-gradient(135deg, #000000 0%, #131313 45%, #3a2e05 78%, #dfb011 130%)",
    caption: "Fellowship in the marketplace",
  },
  {
    background:
      "linear-gradient(25deg, #000000 0%, #1c1602 40%, #6d5406 85%, #dbbb5f 125%)",
    caption: "Mentorship and guidance",
  },
  {
    background:
      "linear-gradient(200deg, #000000 0%, #0e0d0a 50%, #4a3a06 90%, #d0c09e 135%)",
    caption: "A community for every calling",
  },
  {
    background:
      "linear-gradient(315deg, #000000 0%, #161616 40%, #55430a 82%, #dfb011 120%)",
    caption: "Purpose, wisdom, excellence",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  // Auto-advance the slider.
  useEffect(() => {
    const timer = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-black text-white"
    >
      {/* --- Background slide deck (placeholders) --- */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.caption}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 ${i === active ? "animate-ken-burns" : ""}`}
              style={{ background: slide.background }}
            />
            {/* Placeholder marker — remove when real photography is added */}
            {i === active ? (
              <span className="absolute bottom-6 left-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70 sm:left-6">
                Image placeholder — {slide.caption}
              </span>
            ) : null}
          </div>
        ))}

        {/* Readability scrims */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
      </div>

      {/* --- Foreground content --- */}
      <div className="relative mx-auto flex min-h-[560px] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[600px] sm:px-6 sm:py-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft">
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gold"
          >
            <path
              d="M12 2 14.2 8.2 20.5 9.3 15.9 13.7 17 20 12 16.9 7 20l1.1-6.3L3.5 9.3l6.3-1.1L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Free to join
        </p>

        <h1 className="wordmark-rule text-gold-gradient mt-6 text-3xl leading-tight sm:text-4xl lg:text-5xl">
          God is your business partner.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
          A faith-centered business fellowship bringing{" "}
          <strong className="font-semibold text-white">
            student entrepreneurs
          </strong>
          ,{" "}
          <strong className="font-semibold text-white">business owners</strong>
          , and{" "}
          <strong className="font-semibold text-white">professionals</strong>{" "}
          together to grow in purpose, wisdom, and excellence.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="#signup"
            className="inline-flex h-12 min-h-11 w-full items-center justify-center gap-2 rounded bg-gold px-8 text-base font-semibold text-black shadow-gold transition hover:bg-gold-soft sm:w-auto"
          >
            Join the Outreach
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 2v11M4 9.5 8 13.5l4-4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">— scrolls to the sign-up form</span>
          </a>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-white/70">
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7 11H3m0 0 2.5-2.5M3 11l2.5 2.5M17 13h4m0 0-2.5-2.5M21 13l-2.5 2.5M9 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Starting online. In-person meetings coming soon.
        </p>

        {/* --- Slide controls --- */}
        <div
          className="absolute bottom-5 flex items-center gap-2 sm:bottom-7"
          role="group"
          aria-label="Hero background slides"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.caption}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1} of ${SLIDES.length}: ${slide.caption}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-7 bg-gold"
                  : "w-2.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
