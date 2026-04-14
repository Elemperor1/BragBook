import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function StatTile({
  label,
  value,
  helper,
  accent,
  variant = "default",
  className,
}: {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
  variant?: "default" | "lead";
  className?: string;
}) {
  const isLead = variant === "lead";

  return (
    <Card
      variant={isLead ? "feature" : "default"}
      className={cn("rounded-[1.5rem]", className)}
    >
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-sm font-medium",
              isLead ? "text-[#d8cbb8]" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          {accent ? <Badge variant={isLead ? "feature" : "selected"}>{accent}</Badge> : null}
        </div>
        <div className="space-y-1">
          <p
            className={cn(
              "text-[2.4rem] font-semibold tracking-[-0.05em]",
              isLead ? "text-[#fff8ef]" : "text-foreground",
            )}
          >
            {value}
          </p>
          {helper ? (
            <p
              className={cn(
                "text-sm leading-6",
                isLead ? "text-[#d8cbb8]" : "text-muted-foreground",
              )}
            >
              {helper}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
