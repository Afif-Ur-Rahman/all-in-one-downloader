import { faqs } from "@/lib";
import { FaqAccordion } from "./faq-accordion";

export const Faq = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
          Questions, answered.
        </h2>

        <div className="mt-12">
          <FaqAccordion items={faqs} />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};
