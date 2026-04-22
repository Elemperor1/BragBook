import { getQuarterLabel, getQuarterSortKey, parseDateValue } from "@/lib/utils/date";

describe("date utilities", () => {
  it("parses YYYY-MM-DD values as local calendar dates", () => {
    const parsed = parseDateValue("2026-04-01");

    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(3);
    expect(parsed.getDate()).toBe(1);
    expect(parsed.getHours()).toBe(0);
    expect(parsed.getMinutes()).toBe(0);
  });

  it("derives quarter labels and keys correctly for date-only values", () => {
    expect(getQuarterSortKey("2026-04-01")).toBe("2026-Q2");
    expect(getQuarterLabel("2026-04-01")).toBe("Q2 2026");
  });
});
