import { Badge } from "@/components/ui/badge";
import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { ProofStrengthBadge } from "@/components/entries/proof-strength-badge";
import { formatDateRange, formatRelativeTime } from "@/lib/utils/date";

export function EntryMetadataStrip({ entry }: { entry: AccomplishmentEntry }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <ProofStrengthBadge entry={entry} />
      <Badge variant="subtle">{formatDateRange(entry.startDate, entry.endDate)}</Badge>
      {entry.project ? <Badge variant="subtle">{entry.project}</Badge> : null}
      {entry.proofItems.length > 0 ? (
        <Badge variant="subtle">
          {entry.proofItems.length} proof {entry.proofItems.length === 1 ? "item" : "items"}
        </Badge>
      ) : null}
      <span className="ml-auto text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
        Updated {formatRelativeTime(entry.updatedAt)}
      </span>
    </div>
  );
}
