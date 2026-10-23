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
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Three steps, about ten seconds.
          </h2>
        </div>

        <ol className="mt-14 grid overflow-hidden rounded-3xl border border-border bg-surface md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-6 p-8 not-last:border-b not-last:border-border md:not-last:border-r md:not-last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-surface-muted text-foreground">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <span
                  className="font-mono text-5xl font-medium leading-none text-border"
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
