import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import {
  buildEntryFilterOptions,
  filterEntries,
} from "@/lib/utils/entry-search";

const entries: AccomplishmentEntry[] = [
  {
    id: "1",
    title: "Stabilized deploys",
    startDate: "2026-01-02",
    endDate: "2026-01-28",
    project: "Platform",
    situation: "Deploys were flaky.",
    action: "Added guardrails.",
    result: "Deploys stabilized.",
    metric: "Failure rate down 18%",
    stakeholders: ["Release"],
    proofItems: [
      {
        id: "proof-1",
        type: "artifactLink",
        title: "Retro",
        summary: "Release retro and owner notes.",
        link: "https://example.com/retro",
        metric: null,
        localImage: null,
      },
    ],
    tags: ["reliability", "delivery"],
    seniorityTags: ["scope"],
    roleTags: ["staff"],
    createdAt: "2026-01-28T00:00:00.000Z",
    updatedAt: "2026-01-29T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Streamlined onboarding diagnostics",
    startDate: "2026-04-02",
    endDate: null,
    project: "Growth",
    situation: "Support tickets lacked request context.",
    action: "Added a diagnostics panel.",
    result: "Support could route tickets faster.",
    metric: null,
    stakeholders: ["Support"],
    proofItems: [
      {
        id: "proof-2",
        type: "meetingNote",
        title: "Support review",
        summary: "Discussed request ID adoption.",
        link: null,
        metric: null,
        localImage: null,
      },
    ],
    tags: ["support", "observability"],
    seniorityTags: [],
    roleTags: ["senior"],
    createdAt: "2026-04-03T00:00:00.000Z",
    updatedAt: "2026-04-03T00:00:00.000Z",
  },
];

describe("entry search helpers", () => {
  it("builds projects, quarters, tags, and proof strength counts", () => {
    const options = buildEntryFilterOptions(entries);

    expect(options.projects).toEqual(["Growth", "Platform"]);
    expect(options.quarters[0]?.label).toBe("Q2 2026");
    expect(options.tags[0]?.tag).toBe("delivery");
    expect(options.proofStrengthCounts.strongest).toBe(1);
    expect(options.proofStrengthCounts.medium).toBe(1);
  });

  it("filters by project, quarter, tags, proof strength, and text search", () => {
    expect(
      filterEntries(entries, {
        query: "retro",
        project: "Platform",
        quarter: "2026-Q1",
        tags: ["reliability"],
        proofStrength: "strongest",
      }),
    ).toHaveLength(1);

    expect(
      filterEntries(entries, {
        query: "request id",
        project: "all",
        quarter: "all",
        tags: [],
        proofStrength: "all",
      })[0]?.id,
    ).toBe("2");
  });
});
