import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { EntryMetadataStrip } from "@/components/entries/entry-metadata-strip";

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
            {entry.result ?? entry.action ?? "No summary recorded yet."}
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
