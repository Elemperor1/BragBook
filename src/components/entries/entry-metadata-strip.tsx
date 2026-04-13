import { Badge } from "@/components/ui/badge";
import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { proofTypeLabels } from "@/lib/schemas/entry";
import { formatDateRange, formatRelativeTime } from "@/lib/utils/date";

export function EntryMetadataStrip({ entry }: { entry: AccomplishmentEntry }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="subtle">{proofTypeLabels[entry.proofType]}</Badge>
      <Badge variant="subtle">{formatDateRange(entry.startDate, entry.endDate)}</Badge>
      {entry.project ? <Badge variant="subtle">{entry.project}</Badge> : null}
      <span className="ml-auto text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
        Updated {formatRelativeTime(entry.updatedAt)}
      </span>
    </div>
  );
}
