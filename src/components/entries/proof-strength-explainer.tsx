import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { proofStrengthMeta } from "@/lib/proof-strength";

const orderedStrengths = ["weak", "medium", "strong", "strongest"] as const;

export function ProofStrengthExplainer({
  title = "How proof strength works",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("surface-quiet rounded-[1.5rem] border border-border p-4", className)}>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Proof strength is derived automatically from what is saved in the entry.
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {orderedStrengths.map((strength) => {
          const meta = proofStrengthMeta[strength];

          return (
            <div
              key={strength}
              className="rounded-[1.25rem] border border-white/60 bg-white/78 px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <Badge variant={meta.variant}>{meta.badgeLabel}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{meta.rubric}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
