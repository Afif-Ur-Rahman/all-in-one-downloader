export type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const LegalPage = ({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalPageProps) => {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-20">
      <header className="animate-fade-up pb-8 md:pb-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 inline-block rounded-full bg-surface-muted px-3 py-1 font-mono text-xs text-muted">
          Last updated: {lastUpdated}
        </p>
        <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
          {intro}
        </p>
      </header>

      <div
        className="animate-fade-up divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface shadow-soft"
        style={{ animationDelay: "100ms" }}
      >
        {sections.map((section, index) => (
          <section key={section.heading} className="p-5 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-lg font-bold tracking-tight sm:text-xl">
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft font-mono text-xs font-semibold text-accent"
              >
                {index + 1}
              </span>
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted sm:pl-10">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
