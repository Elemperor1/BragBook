import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "field-surface min-h-32 w-full px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-border-strong focus:ring-4 focus:ring-accent/10",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
