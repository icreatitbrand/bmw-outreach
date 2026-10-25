import { SITE } from "@/lib/site";
import { SectionHeading } from "./who-its-for";

/**
 * A Word from the Coordinator (PRD §4.5) — draft message in Appendix A.
 * Photo is a placeholder until Pastor Wisdom's photo is supplied.
 */
export function Coordinator() {
  return (
    <section
      id="coordinator"
      aria-labelledby="coordinator-heading"
      className="bg-ivory-deep px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div id="coordinator-heading" className="text-center">
          <SectionHeading
            kicker="Meet the coordinator"
            title="A Word from Pastor Wisdom"
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white shadow-card">
          {/* Portrait — styled placeholder until the photo is supplied */}
          <div className="flex h-64 items-center justify-center bg-primary sm:h-72">
            <div className="flex flex-col items-center gap-3 text-center">
              <span
                aria-hidden="true"
                className="wordmark-rule flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-primary-deep text-2xl text-gold"
              >
                PW
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Photo coming soon
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                Coordinator&apos;s message
              </span>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink sm:text-lg">
              <p>Dear friend,</p>
              <p>
                Whether you&apos;re building your first venture, running a
                business that has served your family for years, or giving your
                best to your profession, I want you to know something:{" "}
                <strong className="font-semibold">
                  you were never meant to carry it alone.
                </strong>
              </p>
              <p>
                Businessmen &amp; Women Outreach exists to bring believers in
                the marketplace together. Here, we encourage one another, share
                wisdom, and remember that{" "}
                <em className="not-italic text-primary">
                  God is your business partner
                </em>
                . He cares about your work, your decisions, and the people your
                business touches.
              </p>
              <p>
                We&apos;re starting online, and in-person gatherings will
                follow. Everything you need, including meeting details, will be
                shared in our WhatsApp group once you sign up. It&apos;s
                completely free.
              </p>
              <p>I would be honored to have you with us.</p>
              <p className="pt-2">
                <strong className="font-semibold">Warmly,</strong>
                <br />
                <span className="wordmark-rule text-lg text-primary">
                  {SITE.coordinator}
                </span>
                <br />
                <span className="text-sm text-muted">{SITE.coordinatorTitle}</span>
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#signup"
                className="inline-flex h-12 items-center justify-center rounded border-[1.5px] border-primary px-8 text-base font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Join the Outreach
                <span className="sr-only">— scrolls to the sign-up form</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
