import { availablePlatforms } from "@/platforms";
import { LinkForm } from "./form";
import { Lamp } from "./lamp";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black_30%,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-130 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent-soft),transparent)]"
      />

      <Lamp />

      <div className="relative mx-auto w-full max-w-3xl px-4 pt-36 pb-16 text-center sm:px-6 sm:pt-40">
        <h1 className="animate-fade-up font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance md:text-5xl">
          Paste a link.
          <br />
          <span className="text-accent">Save the video.</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-muted text-balance sm:text-lg"
          style={{ animationDelay: "80ms" }}
        >
          Download videos from YouTube, TikTok, Instagram, Facebook and more in
          the quality you choose.
        </p>

        <div
          className="mx-auto mt-10 max-w-2xl animate-fade-up text-left"
          style={{ animationDelay: "160ms" }}
        >
          <LinkForm />
        </div>

        <div
          id="platforms"
          className="mt-10 scroll-mt-16 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <p className="text-sm text-muted">Works with</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {availablePlatforms.map(({ id, name, icon: Icon, color }) => (
              <li
                key={id}
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-3.5 pl-3 text-sm font-medium transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-soft motion-reduce:hover:translate-y-0"
              >
                <Icon className={`size-4 ${color}`} aria-hidden />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
