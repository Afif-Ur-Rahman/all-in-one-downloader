import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-lg bg-surface-muted motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
};
