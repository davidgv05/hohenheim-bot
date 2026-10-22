import { describe, it, expect } from "vitest";
import { stringify } from "yaml";
import { parseDeadlines, loadDeadlines } from "../src/services/deadlines.js";

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
