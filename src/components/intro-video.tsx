"use client";

import { useState } from "react";
import { YOUTUBE_VIDEO_ID } from "@/lib/site";

/**
 * Intro video (PRD §4.4): thumbnail-first, iframe loads only on click
 * to save data. youtube-nocookie.com; 16:9 responsive container.
 * Shows a placeholder until NEXT_PUBLIC_YOUTUBE_VIDEO_ID is set.
 */
export function IntroVideo() {
  const [playing, setPlaying] = useState(false);
  const videoId = YOUTUBE_VIDEO_ID;
  const hasVideo = videoId.length > 0;

  return (
    <section
      id="video"
      aria-labelledby="video-heading"
      className="border-y border-line bg-ivory px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Watch &amp; listen
          </p>
          <h2
            id="video-heading"
            className="wordmark-rule mt-2 text-2xl text-ink sm:text-3xl"
          >
            A Word to You
          </h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-card sm:p-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-primary">
            {hasVideo && playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title="BMW Outreach — intro video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => hasVideo && setPlaying(true)}
                disabled={!hasVideo}
                className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center"
              >
                {hasVideo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt="Introduction video thumbnail"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#000000_0%,#161616_55%,#3a2e05_100%)] p-6 text-center">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      Intro video
                    </span>
                    <p className="wordmark-rule max-w-sm text-xl leading-snug text-white sm:text-2xl">
                      &ldquo;God is your business partner.&rdquo;
                    </p>
                    <p className="text-xs text-white/70">
                      The full introduction video is coming soon.
                    </p>
                  </div>
                )}
                <span
                  className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold text-primary shadow-lg transition group-hover:scale-105"
                  aria-hidden={hasVideo ? undefined : true}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                  <span className="sr-only">
                    {hasVideo ? "Play the intro video" : "Video coming soon"}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
