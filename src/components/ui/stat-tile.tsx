import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function StatTile({
  label,
  value,
  helper,
  accent,
}: {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
}) {
  return (
    <Card className="rounded-[1.75rem]">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {accent ? <Badge variant="subtle">{accent}</Badge> : null}
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {helper ? (
            <p className="text-sm leading-6 text-muted-foreground">{helper}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
