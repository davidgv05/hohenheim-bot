import { describe, it, expect } from "vitest";
import { todayInBerlin, formatDate,addDays } from "../src/lib/time.js";

describe("todayInBerlin", () => {
  it("is already the next day in Berlin shortly after midnight", () => {
    const now = new Date("2026-11-15T23:30:00Z");
    expect(todayInBerlin(now)).toBe("2026-11-16");
  });

  it("handles summer time before the clock change", () => {
    const now = new Date("2026-10-24T22:30:00Z");
    expect(todayInBerlin(now)).toBe("2026-10-25");
  });
});

describe("formatDate", () => {
  it("formats a date in German with the weekday", () => {
    expect(formatDate("2026-11-16")).toBe("Mo., 16.11.2026");
  });
});


describe("addDays", () => {
  it("counts calendar days across the clock change", () => {
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
  });

  it("goes backwards with negative numbers", () => {
    expect(addDays("2026-12-16", -7)).toBe("2026-12-09");
  });
});
