import { cn } from "@/lib/utils/cn";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0 self-start sm:self-auto">{action}</div> : null}
    </div>
  );
}
