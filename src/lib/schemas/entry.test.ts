import {
  accomplishmentEntryInputSchema,
  emptyEntryInput,
} from "@/lib/schemas/entry";

describe("accomplishmentEntryInputSchema", () => {
  it("accepts a valid entry with repeatable proof items", () => {
    const parsed = accomplishmentEntryInputSchema.parse({
      ...emptyEntryInput,
      title: "Improved alert quality",
      startDate: "2026-02-01",
      endDate: "2026-02-14",
      proofItems: [
        {
          id: "proof-1",
          type: "artifactLink",
          title: "Postmortem",
          summary: "Links to the rollout notes and alert tuning decisions.",
          link: "https://example.com/postmortem",
          metric: null,
          localImage: null,
        },
      ],
      tags: ["reliability", "alerts"],
    });

    expect(parsed.title).toBe("Improved alert quality");
    expect(parsed.proofItems[0]?.link).toBe("https://example.com/postmortem");
  });

  it("accepts each supported proof item type", () => {
    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "Collected proof",
        proofItems: [
          {
            id: "1",
            type: "screenshot",
            title: null,
            summary: "Dashboard after the change.",
            link: null,
            metric: null,
            localImage: {
              id: "1",
              name: "proof.png",
              mimeType: "image/png",
              size: 12,
              createdAt: "2026-04-01T00:00:00.000Z",
            },
          },
          {
            id: "2",
            type: "pastedPraise",
            title: null,
            summary: "Great save on the release.",
            link: null,
            metric: null,
            localImage: null,
          },
          {
            id: "3",
            type: "releaseNote",
            title: null,
            summary: "Mentioned in v42 notes.",
            link: "https://example.com/release",
            metric: null,
            localImage: null,
          },
          {
            id: "4",
            type: "metricSnapshot",
            title: null,
            summary: null,
            link: null,
            metric: "Error rate down 30%",
            localImage: null,
          },
          {
            id: "5",
            type: "customerFeedback",
            title: null,
            summary: "Customer called out the faster onboarding path.",
            link: null,
            metric: null,
            localImage: null,
          },
          {
            id: "6",
            type: "artifactLink",
            title: null,
            summary: null,
            link: "https://example.com/pr",
            metric: null,
            localImage: null,
          },
          {
            id: "7",
            type: "meetingNote",
            title: null,
            summary: "Weekly review notes captured the decision.",
            link: null,
            metric: null,
            localImage: null,
          },
          {
            id: "8",
            type: "beforeAfterSummary",
            title: null,
            summary: "Before: manual triage. After: auto-routing.",
            link: null,
            metric: null,
            localImage: null,
          },
        ],
      }),
    ).not.toThrow();
  });

  it("rejects empty titles", () => {
    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "",
      }),
    ).toThrow("Title is required");
  });

  it("rejects invalid proof item link and image combinations", () => {
    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "Added a template",
        proofItems: [
          {
            id: "proof-1",
            type: "artifactLink",
            title: null,
            summary: null,
            link: "not-a-url",
            metric: null,
            localImage: null,
          },
        ],
      }),
    ).toThrow("Link must be a valid URL");

    expect(() =>
      accomplishmentEntryInputSchema.parse({
        ...emptyEntryInput,
        title: "Saved a screenshot",
        proofItems: [
          {
            id: "proof-2",
            type: "screenshot",
            title: null,
            summary: null,
            link: "https://example.com/not-allowed",
            metric: null,
            localImage: null,
          },
        ],
      }),
    ).toThrow("Screenshots need an attached image");
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
