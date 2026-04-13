"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryFiltersPanel } from "@/components/entries/entry-filters-panel";
import { EntryCard } from "@/components/entries/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
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
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/72 p-5">
            <div className="grid gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-11 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/70 bg-white/72 p-6"
              >
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          eyebrow="Evidence capture"
          title="Start your evidence vault before you need it"
          description="Capture one meaningful win now and BragBook turns it into reusable proof for reviews, promotion packets, project recaps, and interview stories later."
          supportingPoints={[
            "Store a metric, artifact, or screenshot so the entry holds up months later.",
            "Use tags and stakeholders now so future drafts can group work by impact, scope, and theme.",
          ]}
          ctaHref="/entries/new"
          ctaLabel="Capture your first entry"
          secondaryCtaHref="/settings"
          secondaryCtaLabel="Load sample entries"
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
