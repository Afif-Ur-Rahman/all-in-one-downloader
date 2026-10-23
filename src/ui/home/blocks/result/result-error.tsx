import { Button } from "@/components";
import { CircleAlert, RotateCcw } from "lucide-react";

type ResultErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export const ResultError = ({
  title = "We couldn't fetch this video",
  message = "Check that the link is correct and the video is public, then try again.",
  onRetry,
}: ResultErrorProps) => {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-center gap-5 rounded-3xl border border-border bg-surface p-8 text-center sm:p-10"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
        <CircleAlert className="size-6" aria-hidden />
      </span>

      <div className="max-w-md">
        <h2 className="font-display text-xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-2 leading-relaxed text-muted">{message}</p>
      </div>

      {onRetry && (
        <Button variant="secondary" icon={<RotateCcw />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
