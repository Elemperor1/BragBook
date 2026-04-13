"use client";

import Link from "next/link";
import { EntryCard } from "@/components/entries/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useEntries } from "@/hooks/use-entry";

export function EntriesPage() {
  const entries = useEntries();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Entries"
        description="Every accomplishment entry is a reusable evidence packet: context, action, result, and proof in one place."
        action={
          <Link href="/entries/new" className={buttonStyles({ size: "lg" })}>
            New entry
          </Link>
        }
      />

      {!entries ? (
        <p className="text-sm text-muted-foreground">Loading entries…</p>
      ) : entries.length === 0 ? (
        <EmptyState
          title="Your vault is empty"
          description="Capture one accomplishment and BragBook will start building your evidence trail."
          ctaHref="/entries/new"
          ctaLabel="Create an entry"
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {entries.length} entries sorted by most recently updated.
          </p>
          <div className="grid gap-4 xl:grid-cols-2">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
