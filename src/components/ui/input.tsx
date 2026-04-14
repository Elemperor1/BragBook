import * as React from "react";
import { cn } from "@/lib/utils/cn";

const variantStyles = {
  default:
    "field-surface h-12 px-4 text-[15px] text-foreground placeholder:text-muted-foreground/90 focus:border-accent/55 focus:ring-4 focus:ring-accent/12",
  document:
    "rounded-[1.25rem] border border-border-strong/90 bg-[rgba(255,251,245,0.98)] px-5 text-[15px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] placeholder:text-muted-foreground/90 focus:border-accent/60 focus:ring-4 focus:ring-accent/12",
} as const;

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    variant?: keyof typeof variantStyles;
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full outline-none transition disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
