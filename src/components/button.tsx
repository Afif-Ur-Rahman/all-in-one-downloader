import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "soft" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground shadow-soft hover:bg-accent-hover",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
  soft: "bg-accent-soft text-accent hover:bg-accent/20",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground",
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
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-semibold whitespace-nowrap select-none",
        "transition-[background-color,color,transform,box-shadow] duration-200 ease-out",
        "active:scale-[0.97] motion-reduce:active:scale-100",
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
