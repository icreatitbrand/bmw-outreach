/**
 * Who It's For (PRD §4.3): three cards with icon, title, one-line benefit.
 * 2px top accent per the design system; stacks on mobile, 3-up on lg.
 */
const AUDIENCES = [
  {
    title: "Student Entrepreneurs",
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09ZM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    copy: "University and tertiary students building early ventures. Get mentorship, spiritual grounding, and community from day one.",
    accent: "gold",
  },
  {
    title: "Business Owners",
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9h18M8 5v4m8-4v4M6 3h12a1 1 0 0 1 1 1l1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1L5 4a1 1 0 0 1 1-1Zm-1 6c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    copy: "Founders and operators at any stage. Find networking, accountability, and faith-aligned guidance for the decisions that matter.",
    accent: "emerald",
  },
  {
    title: "Professionals",
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    copy: "Employed professionals with business interests or marketplace influence. Grow in purpose alongside people who get it.",
    accent: "gold",
  },
] as const;

function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
        {kicker}
      </p>
      <h2 className="wordmark-rule mt-2 text-2xl text-ink sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export { SectionHeading };

export function WhoItsFor() {
  return (
    <section
      id="who-its-for"
      aria-labelledby="who-its-for-heading"
      className="bg-ivory-deep px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div id="who-its-for-heading">
          <SectionHeading
            kicker="A community for every calling"
            title="Who It's For"
          />
        </div>

        <div className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <article
              key={audience.title}
              className={`rounded-lg border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:p-8 border-t-2 ${
                audience.accent === "gold"
                  ? "border-t-gold"
                  : "border-t-primary"
              }`}
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${
                  audience.accent === "gold"
                    ? "bg-gold-soft text-ink"
                    : "bg-primary text-gold"
                }`}
              >
                {audience.icon}
              </div>
              <h3 className="wordmark-rule mt-5 text-xl text-primary">
                {audience.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{audience.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
