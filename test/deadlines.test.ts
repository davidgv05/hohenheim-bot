import { describe, it, expect } from "vitest";
import { stringify } from "yaml";
import { parseDeadlines, loadDeadlines, upcomingDeadlines, type Deadline } from "../src/services/deadlines.js";

const validDeadline = {
  id: "test-registration",
  title: "Anmeldung zu den Modulprüfungen",
  category: "exam-registration",
  start: "2026-11-16",
  end: "2026-12-16",
  faculty: "all",
  source: "https://www.uni-hohenheim.de/semestertermine",
};

describe("parseDeadlines", () => {
  it("accepts valid deadlines and sorts them by start date", () => {
    const text = stringify([
      { ...validDeadline, id: "later", start: "2027-02-08", end: "2027-02-26" },
      { ...validDeadline, id: "earlier" },
    ]);

    const deadlines = parseDeadlines(text);

    expect(deadlines.map((d) => d.id)).toEqual(["earlier", "later"]);
  });

  it("rejects an end date before the start date", () => {
    const text = stringify([{ ...validDeadline, end: "2026-11-01" }]);
    expect(() => parseDeadlines(text)).toThrow("End date must not be before start date");
  });

  it("rejects an impossible date", () => {
    const text = stringify([{ ...validDeadline, start: "2027-02-30" }]);
    expect(() => parseDeadlines(text)).toThrow("Must be a real date");
  });

  it("rejects a duplicate id", () => {
    const text = stringify([validDeadline, validDeadline]);
    expect(() => parseDeadlines(text)).toThrow("Duplicate id");
  });

  it("rejects an unknown category", () => {
    const text = stringify([{ ...validDeadline, category: "party" }]);
    expect(() => parseDeadlines(text)).toThrow();
  });
});

describe("data/deadlines.yaml", () => {
  it("is valid", () => {
    const deadlines = loadDeadlines();
    expect(deadlines.length).toBeGreaterThan(0);
  });
});



function makeDeadline(id: string, start: string, end?: string): Deadline {
  return {
    id,
    title: "Test",
    category: "exams",
    start,
    end,
    faculty: "all",
    source: "https://www.uni-hohenheim.de/semestertermine",
  };
}

describe("upcomingDeadlines", () => {
  const today = "2026-11-16";

  it("drops deadlines that ended before today", () => {
    const result = upcomingDeadlines(
      [makeDeadline("ended-yesterday", "2026-11-01", "2026-11-15")],
      today,
    );
    expect(result).toEqual([]);
  });

  it("keeps running deadlines and those ending today", () => {
    const result = upcomingDeadlines(
      [
        makeDeadline("running", "2026-11-10", "2026-12-01"),
        makeDeadline("ends-today", "2026-11-01", "2026-11-16"),
      ],
      today,
    );
    expect(result.map((d) => d.id)).toEqual(["running", "ends-today"]);
  });

  it("handles single-day deadlines without an end date", () => {
    const result = upcomingDeadlines(
      [
        makeDeadline("yesterday", "2026-11-15"),
        makeDeadline("today", "2026-11-16"),
        makeDeadline("tomorrow", "2026-11-17"),
      ],
      today,
    );
    expect(result.map((d) => d.id)).toEqual(["today", "tomorrow"]);
  });
});
