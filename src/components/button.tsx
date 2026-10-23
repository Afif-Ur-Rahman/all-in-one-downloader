import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-[0_1px_0_0_rgb(255_255_255/0.25)_inset]",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-surface-muted",
  ghost: "text-muted hover:text-foreground hover:bg-surface-muted",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg [&_svg]:size-4",
  md: "h-11 px-5 text-sm rounded-xl [&_svg]:size-4",
  lg: "h-14 px-7 text-base rounded-2xl [&_svg]:size-5",
  icon: "size-11 rounded-xl [&_svg]:size-5",
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  const leadingIcon = loading ? (
    <Loader2 className="animate-spin" aria-hidden />
  ) : iconPosition === "left" ? (
    icon
  ) : null;

  const trailingIcon = !loading && iconPosition === "right" ? icon : null;

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors",
        "disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
};
