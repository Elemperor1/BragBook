import { cn } from "@/lib/utils/cn";

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("animate-pulse rounded-full bg-muted/80", className)} />;
}
