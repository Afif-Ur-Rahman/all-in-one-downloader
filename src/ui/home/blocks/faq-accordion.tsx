"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/faq";

type FaqAccordionProps = {
  items: FaqItem[];
};

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const transition = {
    duration: reduceMotion ? 0 : 0.3,
    ease: "easeInOut" as const,
  };

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={`faq-trigger-${index}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => toggle(index)}
                className={cn(
                  "group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left font-display text-base font-semibold tracking-tight transition-colors duration-200 sm:gap-6 sm:px-6 sm:text-lg",
                  "hover:bg-surface-muted/60 focus-visible:-outline-offset-2",
                  isOpen && "text-accent",
                )}
              >
                {item.question}
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                    isOpen
                      ? "border-transparent bg-accent-soft text-accent"
                      : "border-border bg-surface text-muted group-hover:text-foreground",
                  )}
                >
                  <motion.span
                    initial={false}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={transition}
                    className="flex"
                  >
                    <Plus className="size-4" aria-hidden />
                  </motion.span>
                </span>
              </button>
            </h3>

            <motion.div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-trigger-${index}`}
              inert={!isOpen}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={transition}
              className="overflow-hidden"
            >
              <p className="max-w-2xl px-5 pb-5 leading-relaxed text-muted sm:px-6">
                {item.answer}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
