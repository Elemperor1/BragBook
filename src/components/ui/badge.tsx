import { cn } from "@/lib/utils/cn";

const variants = {
  default: "bg-accent-soft text-foreground",
  subtle: "bg-white/75 text-muted-foreground ring-1 ring-border",
  success: "bg-success/12 text-success",
  warning: "bg-warning/14 text-warning",
};

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
