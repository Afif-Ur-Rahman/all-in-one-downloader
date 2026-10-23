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
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="border-b border-border pb-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-sm text-muted">
          Last updated: {lastUpdated}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>
      </header>

      <div className="divide-y divide-border">
        {sections.map((section, index) => (
          <section key={section.heading} className="py-8">
            <h2 className="font-display text-xl font-bold tracking-tight">
              {index + 1}. {section.heading}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted">
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
