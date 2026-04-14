import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-black/5 bg-ink text-ink-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:bg-[#241d18] focus-visible:ring-ink/20",
  secondary:
    "bg-white/95 text-foreground shadow-[0_12px_24px_rgba(23,19,16,0.08)] ring-1 ring-border-strong hover:-translate-y-0.5 hover:bg-[#fffaf3] focus-visible:ring-accent/20",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground focus-visible:ring-accent/20",
  danger:
    "bg-danger text-white shadow-[0_14px_28px_rgba(156,68,57,0.2)] hover:-translate-y-0.5 hover:bg-[#87362d] focus-visible:ring-danger/25",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-[1rem] border font-semibold tracking-[-0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
