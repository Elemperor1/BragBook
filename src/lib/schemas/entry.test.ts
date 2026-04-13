import { accomplishmentEntryInputSchema, emptyEntryInput } from "@/lib/schemas/entry";

describe("accomplishmentEntryInputSchema", () => {
  it("accepts a valid entry", () => {
    const parsed = accomplishmentEntryInputSchema.parse({
      ...emptyEntryInput,
      title: "Improved alert quality",
      startDate: "2026-02-01",
      endDate: "2026-02-14",
      artifactLink: "https://example.com/postmortem",
      tags: ["reliability", "alerts"],
    });

    expect(parsed.title).toBe("Improved alert quality");
    expect(parsed.artifactLink).toBe("https://example.com/postmortem");
  });

  it("rejects empty titles", () => {
    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "",
      }),
    ).toThrow("Title is required");
  });

  it("rejects invalid artifact links", () => {
    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "Added a template",
        artifactLink: "not-a-url",
      }),
    ).toThrow("Artifact link must be a valid URL");
  });

  it("rejects end dates before start dates", () => {
    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "Added build guardrails",
        startDate: "2026-03-14",
        endDate: "2026-03-10",
      }),
    ).toThrow("End date cannot be earlier than start date");
  });
});
