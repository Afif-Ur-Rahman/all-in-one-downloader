import { ClipboardPaste, Download, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    title: "Paste the link",
    description:
      "Copy the video address from YouTube, TikTok, Instagram, Facebook or any supported site and paste it into the box.",
  },
  {
    icon: SlidersHorizontal,
    title: "Choose a quality",
    description:
      "We read the video and list the available formats, from small MP4 files to full HD, or audio only.",
  },
  {
    icon: Download,
    title: "Download it",
    description:
      "Hit download and the file goes straight to your device. Nothing to install and no account needed.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Three steps, about ten seconds.
          </h2>
        </div>

        <ol className="mt-10 grid overflow-hidden rounded-3xl border border-border bg-surface shadow-soft md:mt-14 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="group relative flex flex-col gap-6 p-6 transition-colors duration-200 hover:bg-accent-soft/40 not-last:border-b not-last:border-border sm:p-8 md:not-last:border-r md:not-last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <span
                  className="font-mono text-5xl leading-none font-medium text-border transition-colors duration-200 group-hover:text-accent/40"
                  aria-hidden
                >
                  0{index + 1}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
