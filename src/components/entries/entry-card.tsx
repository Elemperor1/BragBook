import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { EntryMetadataStrip } from "@/components/entries/entry-metadata-strip";
import { getProofSummary } from "@/lib/utils/proof";

function getEntrySummary(entry: AccomplishmentEntry) {
  return (
    entry.result ??
    entry.metric ??
    entry.action ??
    (entry.proofItems.length > 0 ? getProofSummary(entry) : null) ??
    "No summary recorded yet."
  );
}

export function EntryCard({ entry }: { entry: AccomplishmentEntry }) {
  return (
    <Card className="group rounded-[1.5rem] border-border/90 transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-elevated)]">
      <CardContent className="space-y-4 pt-6">
        <EntryMetadataStrip entry={entry} />
        <div className="space-y-3">
          <Link
            href={`/entries/${entry.id}`}
            className="block font-display text-[1.7rem] leading-[1.02] tracking-[-0.04em] text-foreground transition group-hover:text-accent"
          >
            {entry.title}
          </Link>
          <p className="text-sm leading-7 text-muted-foreground">
            {getEntrySummary(entry)}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {entry.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="subtle">
                {tag}
              </Badge>
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition group-hover:text-foreground">
            Review
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
