import type {
  AccomplishmentEntry,
  ProofStrength,
} from "@/lib/schemas/entry";
import {
  getQuarterLabel,
  getQuarterSortKey,
  getQuarterStart,
  parseDateValue,
} from "@/lib/utils/date";
import { getProofStrength } from "@/lib/utils/proof";
import { sortStrongestEntries } from "@/lib/utils/entry-search";

export interface DashboardStats {
  totalEntries: number;
  entriesThisQuarter: number;
  proofStrengthCounts: Record<ProofStrength, number>;
  recentlyUpdated: AccomplishmentEntry[];
  strongestProofEntries: AccomplishmentEntry[];
  commonTags: Array<{ tag: string; count: number }>;
  entriesByQuarter: Array<{ key: string; label: string; count: number }>;
}

export function buildDashboardStats(
  entries: AccomplishmentEntry[],
  now = new Date(),
): DashboardStats {
  const quarterStart = getQuarterStart(now);
  const proofStrengthCounts: Record<ProofStrength, number> = {
    weak: 0,
    medium: 0,
    strong: 0,
    strongest: 0,
  };
  const tagCounts = new Map<string, number>();
  const quarterCounts = new Map<string, { key: string; label: string; count: number }>();

  for (const entry of entries) {
    proofStrengthCounts[getProofStrength(entry)] += 1;

    for (const tag of entry.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }

    const referenceDate = entry.endDate ?? entry.startDate ?? entry.createdAt;
    const key = getQuarterSortKey(referenceDate);
    const existing = quarterCounts.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      quarterCounts.set(key, {
        key,
        label: getQuarterLabel(referenceDate),
        count: 1,
      });
    }
  }

  const recentlyUpdated = [...entries]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 5);

  const strongestProofEntries = sortStrongestEntries(entries).slice(0, 5);

  const entriesThisQuarter = entries.filter((entry) => {
    const referenceDate = entry.endDate ?? entry.startDate ?? entry.createdAt;
    return parseDateValue(referenceDate) >= quarterStart;
  }).length;

  return {
    totalEntries: entries.length,
    entriesThisQuarter,
    proofStrengthCounts,
    recentlyUpdated,
    strongestProofEntries,
    commonTags: [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((left, right) =>
        right.count === left.count
          ? left.tag.localeCompare(right.tag)
          : right.count - left.count,
      )
      .slice(0, 8),
    entriesByQuarter: [...quarterCounts.values()].sort((left, right) =>
      right.key.localeCompare(left.key),
    ),
  };
}
