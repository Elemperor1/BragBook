import type {
  AccomplishmentEntry,
  ProofStrength,
} from "@/lib/schemas/entry";
import { getQuarterLabel, getQuarterSortKey } from "@/lib/utils/date";
import { getProofStrength, proofStrengthRank } from "@/lib/utils/proof";

export interface EntryFilters {
  query: string;
  project: string;
  quarter: string;
  tags: string[];
  proofStrength: ProofStrength | "all";
}

export interface EntryFilterOptions {
  projects: string[];
  quarters: Array<{ key: string; label: string }>;
  tags: Array<{ tag: string; count: number }>;
  proofStrengthCounts: Record<ProofStrength, number>;
}

export const emptyEntryFilters: EntryFilters = {
  query: "",
  project: "all",
  quarter: "all",
  tags: [],
  proofStrength: "all",
};

function getEntryReferenceDate(entry: AccomplishmentEntry) {
  return entry.endDate ?? entry.startDate ?? entry.createdAt;
}

function getEntrySearchText(entry: AccomplishmentEntry) {
  return [
    entry.title,
    entry.project,
    entry.situation,
    entry.action,
    entry.result,
    entry.metric,
    ...entry.tags,
    ...entry.seniorityTags,
    ...entry.roleTags,
    ...entry.stakeholders,
    ...entry.proofItems.flatMap((item) => [
      item.title,
      item.summary,
      item.link,
      item.metric,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getEntryQuarter(entry: AccomplishmentEntry) {
  const date = getEntryReferenceDate(entry);
  return {
    key: getQuarterSortKey(date),
    label: getQuarterLabel(date),
  };
}

export function filterEntries(entries: AccomplishmentEntry[], filters: EntryFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return entries.filter((entry) => {
    if (filters.project !== "all" && entry.project !== filters.project) {
      return false;
    }

    if (filters.quarter !== "all" && getEntryQuarter(entry).key !== filters.quarter) {
      return false;
    }

    if (
      filters.tags.length > 0 &&
      !filters.tags.every((tag) => entry.tags.includes(tag))
    ) {
      return false;
    }

    if (
      filters.proofStrength !== "all" &&
      getProofStrength(entry) !== filters.proofStrength
    ) {
      return false;
    }

    if (normalizedQuery && !getEntrySearchText(entry).includes(normalizedQuery)) {
      return false;
    }

    return true;
  });
}

export function buildEntryFilterOptions(
  entries: AccomplishmentEntry[],
): EntryFilterOptions {
  const projectSet = new Set<string>();
  const quarterMap = new Map<string, { key: string; label: string }>();
  const tagCounts = new Map<string, number>();
  const proofStrengthCounts: Record<ProofStrength, number> = {
    weak: 0,
    medium: 0,
    strong: 0,
    strongest: 0,
  };

  for (const entry of entries) {
    if (entry.project) {
      projectSet.add(entry.project);
    }

    const quarter = getEntryQuarter(entry);
    quarterMap.set(quarter.key, quarter);

    for (const tag of entry.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }

    proofStrengthCounts[getProofStrength(entry)] += 1;
  }

  return {
    projects: [...projectSet].sort((left, right) => left.localeCompare(right)),
    quarters: [...quarterMap.values()].sort((left, right) =>
      right.key.localeCompare(left.key),
    ),
    tags: [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((left, right) =>
        right.count === left.count
          ? left.tag.localeCompare(right.tag)
          : right.count - left.count,
      ),
    proofStrengthCounts,
  };
}

export function sortStrongestEntries(entries: AccomplishmentEntry[]) {
  return [...entries].sort((left, right) => {
    const strengthDelta =
      proofStrengthRank[getProofStrength(right)] -
      proofStrengthRank[getProofStrength(left)];

    if (strengthDelta !== 0) {
      return strengthDelta;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
