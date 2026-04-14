import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  default: "bg-foreground/[0.06] text-foreground ring-1 ring-foreground/[0.06]",
  subtle: "bg-transparent text-muted-foreground ring-1 ring-border",
  accent: "bg-accent text-accent-foreground shadow-sm",
  selected: "bg-accent-soft text-foreground ring-1 ring-accent/30",
  success: "bg-success/12 text-success ring-1 ring-success/12",
  warning: "bg-warning/14 text-warning ring-1 ring-warning/15",
  danger: "bg-danger/12 text-danger ring-1 ring-danger/12",
  feature: "bg-white/10 text-ink-foreground ring-1 ring-white/10",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
  children: ReactNode;
}) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
