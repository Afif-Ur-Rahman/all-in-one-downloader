import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputSize = "md" | "lg";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
  inputSize?: InputSize;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  error?: string;
  wrapperClassName?: string;
};

const sizes: Record<InputSize, { input: string; icon: string; end: string }> = {
  md: {
    input: "h-11 rounded-xl text-sm",
    icon: "left-3.5 [&_svg]:size-4",
    end: "right-1.5",
  },
  lg: {
    input: "h-16 rounded-2xl text-base",
    icon: "left-5 [&_svg]:size-5",
    end: "right-2",
  },
};

const iconPadding: Record<InputSize, string> = {
  md: "pl-10",
  lg: "pl-13",
};

export const Input = ({
  inputSize = "md",
  icon,
  endAdornment,
  error,
  className,
  wrapperClassName,
  id,
  ...props
}: InputProps) => {
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <div className="relative">
        {icon && (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted",
              sizes[inputSize].icon,
            )}
          >
            {icon}
          </span>
        )}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            "w-full border border-border bg-surface px-4 text-foreground placeholder:text-muted/70",
            "transition-colors hover:border-foreground/25",
            "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500/15",
            sizes[inputSize].input,
            icon && iconPadding[inputSize],
            endAdornment && (inputSize === "lg" ? "pr-40" : "pr-28"),
            className,
          )}
          {...props}
        />

        {endAdornment && (
          <div
            className={cn(
              "absolute top-1/2 flex -translate-y-1/2 items-center gap-1",
              sizes[inputSize].end,
            )}
          >
            {endAdornment}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
