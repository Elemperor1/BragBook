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
    metric: "Build failures fell from 18% to 3%.",
    stakeholders: [],
    proofItems: [
      {
        id: "proof-1",
        type: "artifactLink",
        title: "Retro",
        summary: null,
        link: "https://example.com/retro",
        metric: null,
        localImage: null,
      },
    ],
    tags: ["reliability", "delivery"],
    seniorityTags: [],
    roleTags: [],
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
    proofItems: [
      {
        id: "proof-2",
        type: "meetingNote",
        title: "Runbook review",
        summary: "Documented the recovery workflow during the retro.",
        link: null,
        metric: null,
        localImage: null,
      },
    ],
    tags: ["runbooks"],
    seniorityTags: [],
    roleTags: [],
    createdAt: "2025-10-04T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
];

describe("buildDashboardStats", () => {
  it("computes totals, proof strength counts, and derived sections", () => {
    const stats = buildDashboardStats(entries, new Date("2026-02-15T00:00:00.000Z"));

    expect(stats.totalEntries).toBe(2);
    expect(stats.entriesThisQuarter).toBe(1);
    expect(stats.proofStrengthCounts.strongest).toBe(1);
    expect(stats.proofStrengthCounts.medium).toBe(1);
    expect(stats.recentlyUpdated[0]?.id).toBe("2");
    expect(stats.strongestProofEntries[0]?.id).toBe("1");
    expect(stats.commonTags[0]?.tag).toBe("delivery");
    expect(stats.entriesByQuarter[0]?.label).toBe("Q1 2026");
  });
});
