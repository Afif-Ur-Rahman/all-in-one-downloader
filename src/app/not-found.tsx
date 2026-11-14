import Link from "next/link";
import { ArrowLeft, Link2Off } from "lucide-react";
import { cn } from "@/lib/utils";

const NotFound = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-20 sm:px-6 md:py-24">
      <div className="max-w-xl animate-fade-up">
        <div className="float-soft flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent shadow-soft">
          <Link2Off className="size-6" aria-hidden />
        </div>

        <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
          This link is broken.
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          The page you are looking for does not exist or has been moved. Check
          the address, or head back and paste a video link instead.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-soft transition-[background-color,transform] duration-200 active:scale-[0.97]",
              "bg-accent text-accent-foreground hover:bg-accent-hover",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
          <Link
            href="/#faq"
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-[background-color,transform] duration-200 active:scale-[0.97]",
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
