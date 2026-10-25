"use client";

import { useEffect, useRef, useState } from "react";

interface ThankYouModalProps {
  open: boolean;
  firstName: string;
  whatsappUrl: string;
  onClose: () => void;
}

/**
 * Thank-you modal (PRD §6): accessible dialog with focus trap,
 * Escape-to-close, scroll lock, focus return, and a bottom-sheet
 * treatment on mobile that centers on desktop.
 */
export function ThankYouModal({
  open,
  firstName,
  whatsappUrl,
  onClose,
}: ThankYouModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const whatsappButtonRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Scroll lock + focus management + Escape/Tab handling
  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Initial focus: the primary action when present, else Close.
    const timer = window.setTimeout(() => {
      (whatsappButtonRef.current ?? closeButtonRef.current)?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      triggerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Scrim — opaque black, no blur for better performance on mobile */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.65)]"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-heading"
        className="relative w-full animate-[sheet-up_.25s_ease-out] bg-white p-6 shadow-modal rounded-t-xl sm:max-w-md sm:rounded-xl sm:animate-[fade-in_.2s_ease-out] sm:p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded text-muted transition hover:bg-ivory-deep hover:text-ink"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="text-center">
          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-gold-dark"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 14.2 8.2 20.5 9.3 15.9 13.7 17 20 12 16.9 7 20l1.1-6.3L3.5 9.3l6.3-1.1L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <h2
            id="thank-you-heading"
            className="wordmark-rule mt-4 text-2xl text-primary"
          >
            Welcome to the Outreach, {firstName}!
          </h2>

          <p className="mt-3 leading-relaxed text-muted">
            Thank you for signing up. A confirmation email is on its way to
            your inbox — it has your WhatsApp group invite too.
          </p>

          {whatsappUrl ? (
            <a
              ref={whatsappButtonRef}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded bg-primary px-6 text-base font-semibold text-white shadow-card transition hover:bg-primary-deep hover:shadow-card-hover"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 9.5c0 3.6 2.4 6 6 6l1.5-1.5-2-2-1 .5a4.4 4.4 0 0 1-1.5-1.5l.5-1-2-2-1.5 1.5Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
              Join the WhatsApp Group
            </a>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded text-sm font-semibold text-muted transition hover:text-ink"
          >
            Back to the site
          </button>

          <p className="mt-4 text-xs text-muted">
            Meeting details are shared in the group.
          </p>
        </div>
      </div>
    </div>
  );
}
