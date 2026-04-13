import type { AccomplishmentEntry, ProofType } from "@/lib/schemas/entry";
import { proofTypeOptions } from "@/lib/schemas/entry";
import { getQuarterStart } from "@/lib/utils/date";

export interface DashboardStats {
  totalEntries: number;
  entriesThisQuarter: number;
  proofTypeCounts: Record<ProofType, number>;
  recentlyUpdated: AccomplishmentEntry[];
}

export function buildDashboardStats(
  entries: AccomplishmentEntry[],
  now = new Date(),
): DashboardStats {
  const quarterStart = getQuarterStart(now);

  const proofTypeCounts = proofTypeOptions.reduce(
    (accumulator, proofType) => {
      accumulator[proofType] = 0;
      return accumulator;
    },
    {} as Record<ProofType, number>,
  );

  for (const entry of entries) {
    proofTypeCounts[entry.proofType] += 1;
  }

  const recentlyUpdated = [...entries]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 5);

  const entriesThisQuarter = entries.filter((entry) => {
    const referenceDate = entry.endDate ?? entry.updatedAt;
    return new Date(referenceDate) >= quarterStart;
  }).length;

  return {
    totalEntries: entries.length,
    entriesThisQuarter,
    proofTypeCounts,
    recentlyUpdated,
  };
}
