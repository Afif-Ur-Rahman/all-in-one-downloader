import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { DownloadsMenu } from "@/ui";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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

        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <DownloadsMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
