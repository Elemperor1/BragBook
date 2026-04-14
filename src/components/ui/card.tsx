import * as React from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "quiet" | "elevated" | "feature" | "document";

const variantStyles: Record<CardVariant, string> = {
  default: "surface-card",
  quiet: "surface-quiet shadow-none",
  elevated: "surface-elevated",
  feature: "surface-feature border-white/10 text-[#f7f1e8]",
  document: "surface-document",
};

export const Card = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    variant?: CardVariant;
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[1.25rem] border border-border/90 text-card-foreground",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-3 p-6 md:p-7", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-display text-[1.5rem] leading-[1.02] tracking-[-0.04em]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[15px] leading-7 text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardEyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("eyebrow-label", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6 md:px-7 md:pb-7", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-6 pb-6 md:px-7 md:pb-7",
        className,
      )}
      {...props}
    />
  );
}
