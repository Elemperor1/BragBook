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
    <Card className="rounded-[1.75rem] transition hover:-translate-y-0.5 hover:bg-white/90">
      <CardContent className="space-y-4 pt-6">
        <EntryMetadataStrip entry={entry} />
        <div className="space-y-3">
          <Link
            href={`/entries/${entry.id}`}
            className="block text-xl font-semibold tracking-tight text-foreground hover:text-accent"
          >
            {entry.title}
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            {getEntrySummary(entry)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="subtle">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
