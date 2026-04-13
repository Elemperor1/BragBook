import type { AccomplishmentEntry } from "@/lib/schemas/entry";
import {
  renderPromotionCase,
  renderResumeBullet,
  renderSelfReview,
  renderStarStory,
} from "@/lib/templates";

const entry: AccomplishmentEntry = {
  id: "entry-1",
  title: "Stabilized CI for monorepo builds",
  startDate: "2026-01-01",
  endDate: "2026-01-30",
  project: "Developer Platform",
  situation: "Release confidence had fallen because the build lane flaked repeatedly.",
  action: "Split caches, audited flaky jobs, and added guardrails around lockfile drift.",
  result: "Engineers regained confidence in main-branch merges.",
  metric: "Failure rate dropped from 18% to 3%.",
  stakeholders: ["Platform", "Release"],
  proofType: "metric",
  proofNotes: null,
  pastedPraise: null,
  artifactLink: null,
  tags: ["reliability"],
  seniorityTags: ["scope"],
  roleTags: ["staff"],
  localImage: null,
  createdAt: "2026-01-30T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
};

describe("template renderers", () => {
  it("renders self review and promotion case sections", () => {
    expect(renderSelfReview(entry)).toContain("Impact Summary: Stabilized CI for monorepo builds");
    expect(renderPromotionCase(entry)).toContain("Scope Signals: scope, staff");
  });

  it("renders a concise resume bullet", () => {
    expect(renderResumeBullet(entry)).toBe(
      "Split caches, audited flaky jobs, and added guardrails around lockfile drift, for Developer Platform, delivering failure rate dropped from 18% to 3%.",
    );
  });

  it("renders a STAR story", () => {
    expect(renderStarStory(entry)).toContain("Situation: Release confidence had fallen");
    expect(renderStarStory(entry)).toContain("Result: Engineers regained confidence in main-branch merges.");
  });
});
