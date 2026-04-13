import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "field-surface h-12 w-full px-4 text-sm text-foreground outline-none transition focus:border-border-strong focus:ring-4 focus:ring-accent/10",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
