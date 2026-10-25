import { SectionHeading } from "./who-its-for";

/**
 * How It Works (PRD §4.6): Sign up → Join the WhatsApp group → Get meeting
 * details, plus a note that the outreach starts online.
 */
const STEPS = [
  {
    title: "Sign up",
    copy: "Fill in the short form below — just your name, email, WhatsApp number, and a quick hello about who you are.",
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8l-5-5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 13.5 12.5 16 17 11.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Join the WhatsApp group",
    copy: "Get the invite instantly on screen and in your welcome email. Tap once and you're in.",
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.5c0 3.6 2.4 6 6 6l1.5-1.5-2-2-1 .5a4.4 4.4 0 0 1-1.5-1.5l.5-1-2-2-1.5 1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Get meeting details",
    copy: "Schedule, links, and dates are shared in the group. Online first — in-person meetings are coming.",
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 3v4m8-4v4M3 10h18M8.5 14.5 10.5 16.5 15 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-y border-line bg-ivory px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div id="how-it-works-heading">
          <SectionHeading kicker="Here's how it works" title="How It Works" />
        </div>

        <ol className="mt-10 grid gap-10 sm:gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="flex gap-4 md:flex-col">
                <div className="flex flex-col items-center md:flex-col">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-card"
                  >
                    {step.icon}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-6 top-14 h-[calc(100%-1rem)] w-px bg-line md:hidden"
                    />
                  )}
                </div>
                <div className="max-w-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                    Step {index + 1}
                  </p>
                  <h3 className="wordmark-rule mt-1 text-xl text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.copy}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-muted">
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 11H3m0 0 2.5-2.5M3 11l2.5 2.5M17 13h4m0 0-2.5-2.5M21 13l-2.5 2.5M9 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          We start online — in-person meetings are coming soon.
        </p>
      </div>
    </section>
  );
}
