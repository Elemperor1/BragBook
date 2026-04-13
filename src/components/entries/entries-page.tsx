"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryCard } from "@/components/entries/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles, Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useEntries } from "@/hooks/use-entry";
import {
  proofStrengthLabels,
  proofStrengthOptions,
} from "@/lib/schemas/entry";
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

  function toggleTag(tag: string) {
    setFilters((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  }

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
          <div className="rounded-[2rem] border border-border bg-white/60 p-5">
            <div className="grid gap-4 xl:grid-cols-4">
              <div className="space-y-2 xl:col-span-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <Input
                  value={filters.query}
                  placeholder="Search title, project, result, metrics, proof, or tags"
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      query: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project</label>
                <Select
                  value={filters.project}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      project: event.target.value,
                    }))
                  }
                >
                  <option value="all">All projects</option>
                  {filterOptions.projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quarter</label>
                <Select
                  value={filters.quarter}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      quarter: event.target.value,
                    }))
                  }
                >
                  <option value="all">All quarters</option>
                  {filterOptions.quarters.map((quarter) => (
                    <option key={quarter.key} value={quarter.key}>
                      {quarter.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Proof strength
                </label>
                <Select
                  value={filters.proofStrength}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      proofStrength: event.target.value as EntryFilters["proofStrength"],
                    }))
                  }
                >
                  <option value="all">All strengths</option>
                  {proofStrengthOptions.map((strength) => (
                    <option key={strength} value={strength}>
                      {proofStrengthLabels[strength]} ({filterOptions.proofStrengthCounts[strength]})
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-foreground">Tags</p>
              {filterOptions.tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags yet.</p>
              ) : (
                filterOptions.tags.map(({ tag, count }) => {
                  const active = filters.tags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full"
                      onClick={() => toggleTag(tag)}
                    >
                      <Badge variant={active ? "default" : "subtle"}>
                        {tag} ({count})
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <p>
                Showing {filteredEntries.length} of {entries.length} entries.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setFilters(emptyEntryFilters)}>
                Reset filters
              </Button>
            </div>
          </div>

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
