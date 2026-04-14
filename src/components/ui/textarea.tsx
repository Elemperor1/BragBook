import * as React from "react";
import { cn } from "@/lib/utils/cn";

const variantStyles = {
  default:
    "field-surface min-h-32 px-4 py-3 text-[15px] leading-7 text-foreground placeholder:text-muted-foreground/90 focus:border-accent/55 focus:ring-4 focus:ring-accent/12",
  document:
    "surface-document min-h-32 rounded-[1.5rem] border border-border-strong/80 px-6 py-6 text-base leading-[1.82] tracking-[-0.01em] text-[#2d241b] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] focus:border-accent/55 focus:ring-4 focus:ring-accent/10",
} as const;

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant?: keyof typeof variantStyles;
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <textarea
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

Textarea.displayName = "Textarea";
