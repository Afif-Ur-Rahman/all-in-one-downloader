import Link from "next/link";
import { ArrowLeft, Link2Off } from "lucide-react";
import { cn } from "@/lib/utils";

const NotFound = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-24">
      <div className="max-w-xl">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
          <Link2Off className="size-6" aria-hidden />
        </div>

        <p className="mt-8 font-mono text-sm text-muted">Error 404</p>

        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight md:text-6xl">
          This link is broken.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-muted">
          The page you are looking for does not exist or has been moved. Check
          the address, or head back and paste a video link instead.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
              "bg-accent text-accent-foreground hover:bg-accent-hover",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
          <Link
            href="/#faq"
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-colors",
              "border-border bg-surface hover:bg-surface-muted",
            )}
          >
            Read the FAQ
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
