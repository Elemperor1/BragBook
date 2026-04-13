import { cn } from "@/lib/utils/cn";

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
          Career Evidence Vault
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
