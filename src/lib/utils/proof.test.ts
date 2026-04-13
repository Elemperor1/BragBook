import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import { getProofStrength } from "@/lib/utils/proof";

const baseEntry: AccomplishmentEntry = {
  id: "entry-1",
  title: "Proof test",
  startDate: null,
  endDate: null,
  project: null,
  situation: null,
  action: null,
  result: null,
  metric: null,
  stakeholders: [],
  proofItems: [],
  tags: [],
  seniorityTags: [],
  roleTags: [],
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
};

describe("getProofStrength", () => {
  it("classifies weak proof", () => {
    expect(getProofStrength(baseEntry)).toBe("weak");
  });

  it("classifies medium proof for narrative-only evidence", () => {
    expect(
      getProofStrength({
        ...baseEntry,
        proofItems: [
          {
            id: "proof-1",
            type: "meetingNote",
            title: null,
            summary: "Documented in the retro.",
            link: null,
            metric: null,
            localImage: null,
          },
        ],
      }),
    ).toBe("medium");
  });

  it("classifies strong proof for artifact or quote evidence", () => {
    expect(
      getProofStrength({
        ...baseEntry,
        proofItems: [
          {
            id: "proof-1",
            type: "customerFeedback",
            title: null,
            summary: "Customer called out the improvement.",
            link: null,
            metric: null,
            localImage: null,
          },
        ],
      }),
    ).toBe("strong");
  });

  it("classifies strong proof for a top-line metric without saved proof items", () => {
    expect(
      getProofStrength({
        ...baseEntry,
        metric: "Cut onboarding time from 4 days to 2 days.",
      }),
    ).toBe("strong");
  });

  it("classifies strongest proof for metric plus concrete evidence", () => {
    expect(
      getProofStrength({
        ...baseEntry,
        metric: "Latency down 42%",
        proofItems: [
          {
            id: "proof-1",
            type: "artifactLink",
            title: null,
            summary: null,
            link: "https://example.com/retro",
            metric: null,
            localImage: null,
          },
        ],
      }),
    ).toBe("strongest");
  });
});
