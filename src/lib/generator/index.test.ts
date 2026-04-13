import { generateOutput } from "@/lib/generator";
import { sampleEntries } from "@/test/fixtures/entries";

describe("generator output", () => {
  it("renders self-review sections with evidence-grounded details", () => {
    const output = generateOutput({
      entries: sampleEntries.slice(0, 4),
      outputType: "selfReview",
      tone: "confident",
      variantIndex: 0,
    });

    expect(output).toContain("Summary of the period");
    expect(output).toContain("Key accomplishments");
    expect(output).toContain("Team or business impact");
    expect(output).toContain("Collaboration and leadership");
    expect(output).toContain("Growth areas");
    expect(output).toContain("Next steps");
    expect(output).toContain("Failure rate dropped from 18% to 3% within one sprint.");
    expect(output).toContain("Median time-to-triage fell from 2.4 days to 6 hours.");
  });

  it("renders promotion framing, grouped evidence, and proof-backed sections", () => {
    const output = generateOutput({
      entries: sampleEntries.slice(0, 3),
      outputType: "promotionCase",
      tone: "executive",
      targetLevel: "Staff Engineer",
      variantIndex: 0,
    });

    expect(output).toContain("Case for Staff Engineer");
    expect(output).toContain("Evidence grouped by competency or impact area");
    expect(output).toContain("Business impact");
    expect(output).toContain("Leadership and influence");
    expect(output).toContain("Proof-backed examples");
    expect(output).toContain(
      '"The new diagnostics flow saved us multiple back-and-forth rounds this week."',
    );
  });

  it("keeps resume bullets grounded while tone changes phrasing", () => {
    const concise = generateOutput({
      entries: sampleEntries.slice(0, 2),
      outputType: "resumeBullets",
      tone: "concise",
      variantIndex: 0,
    });
    const technical = generateOutput({
      entries: sampleEntries.slice(0, 2),
      outputType: "resumeBullets",
      tone: "technical",
      variantIndex: 0,
    });

    expect(concise).toContain("failure rate dropped from 18% to 3% within one sprint.");
    expect(technical).toContain("failure rate dropped from 18% to 3% within one sprint.");
    expect(technical).not.toBe(concise);
  });

  it("renders multiple distinct STAR stories with labeled sections", () => {
    const output = generateOutput({
      entries: sampleEntries,
      outputType: "starStories",
      tone: "technical",
      variantIndex: 0,
    });

    expect(output).toContain("Story 1:");
    expect(output).toContain("Story 2:");
    expect(output).toContain("Story 3:");
    expect(output.match(/Situation:/g)).toHaveLength(3);
    expect(output.match(/Task:/g)).toHaveLength(3);
    expect(output.match(/Action:/g)).toHaveLength(3);
    expect(output.match(/Result:/g)).toHaveLength(3);
  });

  it("cycles variants deterministically and does not invent proof for weak entries", () => {
    const variantZero = generateOutput({
      entries: sampleEntries.slice(0, 3),
      outputType: "selfReview",
      tone: "confident",
      variantIndex: 0,
    });
    const variantOne = generateOutput({
      entries: sampleEntries.slice(0, 3),
      outputType: "selfReview",
      tone: "confident",
      variantIndex: 1,
    });
    const weakPromotion = generateOutput({
      entries: [sampleEntries[3]],
      outputType: "promotionCase",
      tone: "concise",
      targetLevel: "Staff Engineer",
      variantIndex: 0,
    });

    expect(generateOutput({
      entries: sampleEntries.slice(0, 3),
      outputType: "selfReview",
      tone: "confident",
      variantIndex: 0,
    })).toBe(variantZero);
    expect(variantOne).not.toBe(variantZero);
    expect(variantOne).toContain("Failure rate dropped from 18% to 3% within one sprint.");
    expect(weakPromotion).toContain(
      "The selected entries need stronger artifact or quote capture before this section is persuasive.",
    );
    expect(weakPromotion).not.toContain("18% to 3%");
  });
});
