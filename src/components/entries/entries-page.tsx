"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryFiltersPanel } from "@/components/entries/entry-filters-panel";
import { EntryCard } from "@/components/entries/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useEntries } from "@/hooks/use-entry";
import {
  buildEntryFilterOptions,
  emptyEntryFilters,
  filterEntries,
  type EntryFilters,
} from "@/lib/utils/entry-search";

export function EntriesPage() {
  const entries = useEntries();
  const [filters, setFilters] = useState<EntryFilters>(emptyEntryFilters);

  const filterOptions = useMemo(
    () => (entries ? buildEntryFilterOptions(entries) : null),
    [entries],
  );
  const filteredEntries = useMemo(
    () => (entries ? filterEntries(entries, filters) : null),
    [entries, filters],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Entries"
        description="Every accomplishment entry is a reusable evidence packet: context, result, and proof in one place."
        action={
          <Link href="/entries/new" className={buttonStyles({ size: "lg" })}>
            New entry
          </Link>
        }
      />

      {!entries || !filterOptions || !filteredEntries ? (
        <p className="text-sm text-muted-foreground">Loading entries…</p>
      ) : entries.length === 0 ? (
        <EmptyState
          title="Start your evidence vault before you need it"
          description="Capture one meaningful win now and BragBook turns it into something you can reuse for reviews, promo packets, and project recaps later."
          ctaHref="/entries/new"
          ctaLabel="Capture your first entry"
          secondaryCtaHref="/settings"
          secondaryCtaLabel="Load demo entries"
        />
      ) : (
        <div className="space-y-6">
          <EntryFiltersPanel
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            filteredCount={filteredEntries.length}
            totalEntries={entries.length}
          />

          {filteredEntries.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-border-strong/70 bg-white/55 px-6 py-8">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                No entries match these filters
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Try clearing one filter, widening the quarter range, or searching with a project or tag name instead.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
