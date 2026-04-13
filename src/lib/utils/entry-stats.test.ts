import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { buildDashboardStats } from "@/lib/utils/entry-stats";

const entries: AccomplishmentEntry[] = [
  {
    id: "1",
    title: "Improved deploy stability",
    startDate: "2026-01-04",
    endDate: "2026-01-20",
    project: "Platform",
    situation: null,
    action: null,
    result: null,
    metric: null,
    stakeholders: [],
    proofType: "metric",
    proofNotes: null,
    pastedPraise: null,
    artifactLink: null,
    tags: [],
    seniorityTags: [],
    roleTags: [],
    localImage: null,
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Documented incident recovery",
    startDate: "2025-10-01",
    endDate: "2025-10-04",
    project: "SRE",
    situation: null,
    action: null,
    result: null,
    metric: null,
    stakeholders: [],
    proofType: "doc",
    proofNotes: null,
    pastedPraise: null,
    artifactLink: null,
    tags: [],
    seniorityTags: [],
    roleTags: [],
    localImage: null,
    createdAt: "2025-10-04T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
];

describe("buildDashboardStats", () => {
  it("computes totals, proof counts, and recent updates", () => {
    const stats = buildDashboardStats(entries, new Date("2026-02-15T00:00:00.000Z"));

    expect(stats.totalEntries).toBe(2);
    expect(stats.entriesThisQuarter).toBe(1);
    expect(stats.proofTypeCounts.metric).toBe(1);
    expect(stats.proofTypeCounts.doc).toBe(1);
    expect(stats.recentlyUpdated[0]?.id).toBe("2");
  });
});
