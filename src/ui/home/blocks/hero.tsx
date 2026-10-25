import type { IconType } from "react-icons";
import {
  SiFacebook,
  SiInstagram,
  SiReddit,
  SiTiktok,
  SiVimeo,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { LinkForm } from "./form";

type Platform = {
  name: string;
  icon: IconType;
  color: string;
};

const platforms: Platform[] = [
  { name: "YouTube", icon: SiYoutube, color: "text-[#FF0000]" },
  { name: "TikTok", icon: SiTiktok, color: "text-foreground" },
  { name: "Instagram", icon: SiInstagram, color: "text-[#E4405F]" },
  { name: "Facebook", icon: SiFacebook, color: "text-[#0866FF]" },
  { name: "X (Twitter)", icon: SiX, color: "text-foreground" },
  { name: "Vimeo", icon: SiVimeo, color: "text-[#1AB7EA]" },
  { name: "Reddit", icon: SiReddit, color: "text-[#FF4500]" },
];

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden scroll-mt-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black_30%,transparent)]"
      />

      <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-balance md:text-5xl">
          Paste a link.
          <br />
          <span className="text-accent">Save the video.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted text-balance">
          Download videos from YouTube, TikTok, Instagram, Facebook and more in
          the quality you choose.
        </p>

        <div className="mx-auto mt-10 max-w-2xl text-left">
          <LinkForm />
        </div>

        <div id="platforms" className="scroll-mt-16 mt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Works with
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {platforms.map(({ name, icon: Icon, color }) => (
              <li
                key={name}
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-3 pr-3.5 text-sm font-medium"
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
