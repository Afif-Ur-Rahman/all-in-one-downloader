import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { siteConfig } from "@/lib/site";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Platforms", href: "/#platforms" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of use", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "DMCA", href: "/dmca" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="col-span-2 max-w-sm md:col-span-1">
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${siteConfig.name} home`}
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-soft transition-transform duration-200 group-hover:scale-105">
                <ArrowDownToLine
                  className="size-4.5"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                {siteConfig.shortName}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Paste a link, pick a quality, and save the video. Works with the
              platforms you use every day.
            </p>
          </div>

          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-muted transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-accent motion-reduce:hover:translate-x-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="max-w-lg rounded-xl bg-surface-muted px-3.5 py-2.5 leading-relaxed md:text-right">
            Only download content you own or have permission to save. We are not
            affiliated with YouTube, TikTok, Instagram, Facebook, X, Vimeo, or
            Reddit.
          </p>
        </div>
      </div>
    </footer>
  );
};
