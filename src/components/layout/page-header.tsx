import { cn } from "@/lib/utils/cn";

export function PageHeader({
  title,
  description,
  action,
  className,
  eyebrow,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <header
      className={cn(
        "mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {eyebrow ? <p className="eyebrow-label">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h1 className="page-title text-foreground">{title}</h1>
          <p className="max-w-2xl support-copy">{description}</p>
        </div>
      </div>
      {action ? <div className="shrink-0 self-start lg:self-auto">{action}</div> : null}
    </header>
  );
}
