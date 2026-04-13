"use client";

import type * as React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { proofStrengthMeta } from "@/lib/proof-strength";
import { proofStrengthOptions } from "@/lib/schemas/entry";
import { cn } from "@/lib/utils/cn";
import type {
  EntryFilterOptions,
  EntryFilters,
} from "@/lib/utils/entry-search";

export function EntryFiltersPanel({
  filters,
  setFilters,
  filterOptions,
  totalEntries,
  filteredCount,
  className,
  queryPlaceholder = "Search title, project, result, metrics, proof, or tags",
}: {
  filters: EntryFilters;
  setFilters: React.Dispatch<React.SetStateAction<EntryFilters>>;
  filterOptions: EntryFilterOptions;
  totalEntries: number;
  filteredCount: number;
  className?: string;
  queryPlaceholder?: string;
}) {
  const [showAllTags, setShowAllTags] = useState(false);

  function toggleTag(tag: string) {
    setFilters((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  }

  const visibleTags = showAllTags ? filterOptions.tags : filterOptions.tags.slice(0, 8);

  return (
    <div className={cn("rounded-[2rem] border border-border bg-white/60 p-5", className)}>
      <div className="grid gap-4 xl:grid-cols-4">
        <div className="space-y-2 xl:col-span-2">
          <label
            htmlFor="entry-filter-search"
            className="text-sm font-medium text-foreground"
          >
            Search
          </label>
          <Input
            id="entry-filter-search"
            value={filters.query}
            placeholder={queryPlaceholder}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="entry-filter-project"
            className="text-sm font-medium text-foreground"
          >
            Project
          </label>
          <Select
            id="entry-filter-project"
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
          <label
            htmlFor="entry-filter-quarter"
            className="text-sm font-medium text-foreground"
          >
            Quarter
          </label>
          <Select
            id="entry-filter-quarter"
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
          <label
            htmlFor="entry-filter-proof-strength"
            className="text-sm font-medium text-foreground"
          >
            Proof strength
          </label>
          <Select
            id="entry-filter-proof-strength"
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
                  {proofStrengthMeta[strength].filterLabel} ({filterOptions.proofStrengthCounts[strength]})
                </option>
              ))}
            </Select>
            <p className="text-xs leading-5 text-muted-foreground">
              Strongest proof means a metric plus a concrete quote, artifact, or screenshot.
            </p>
          </div>
        </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium text-foreground">Tags</p>
        {filterOptions.tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags yet.</p>
        ) : (
          visibleTags.map(({ tag, count }) => {
            const active = filters.tags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                className="rounded-full"
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
              >
                <Badge variant={active ? "default" : "subtle"}>
                  {tag} ({count})
                </Badge>
              </button>
            );
          })
        )}
        {filterOptions.tags.length > 8 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllTags((current) => !current)}
          >
            {showAllTags ? "Show fewer tags" : "Show all tags"}
          </Button>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing {filteredCount} of {totalEntries} entries.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setFilters({
          query: "",
          project: "all",
          quarter: "all",
          tags: [],
          proofStrength: "all",
        })}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
