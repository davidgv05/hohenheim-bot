import { describe, it, expect } from "vitest";
import type { Deadline } from "../src/services/deadlines.js";
import { remindersDueOn } from "../src/services/reminders.js";

function makeDeadline(
  id: string,
  category: Deadline["category"],
  start: string,
  end?: string,
): Deadline {
  return {
    id,
    title: "Test",
    category,
    start,
    end,
    faculty: "all",
    source: "https://www.uni-hohenheim.de/semestertermine",
  };
}

const registration = makeDeadline("reg", "exam-registration", "2026-11-16", "2026-12-16");
const reRegistration = makeDeadline("rereg", "re-registration", "2027-02-15");
const exams = makeDeadline("exams", "exams", "2027-02-08", "2027-02-26");
const christmas = makeDeadline("xmas", "semester", "2026-12-23", "2027-01-06");
const all = [registration, reRegistration, exams, christmas];

function keysOn(today: string): string[] {
  return remindersDueOn(all, today).map((r) => r.key);
}

describe("remindersDueOn", () => {
  it("reminds on the day a registration opens", () => {
    expect(keysOn("2026-11-16")).toEqual(["reg:opens-today"]);
  });

  it("reminds 7 days and 1 day before a registration closes", () => {
    expect(keysOn("2026-12-09")).toEqual(["reg:closes-in-7-days"]);
    expect(keysOn("2026-12-15")).toEqual(["reg:closes-tomorrow"]);
  });

  it("sends nothing on days without a reminder", () => {
    expect(keysOn("2026-11-20")).toEqual([]);
  });

  it("has no opening reminder for single-day deadlines", () => {
    expect(keysOn("2027-02-08")).toContain("rereg:closes-in-7-days");
    expect(keysOn("2027-02-14")).toEqual(["rereg:closes-tomorrow"]);
    expect(keysOn("2027-02-15")).toEqual([]);
  });

  it("reminds 7 days before exams start", () => {
    expect(keysOn("2027-02-01")).toEqual(["exams:starts-in-7-days"]);
  });

  it("never reminds about semester dates", () => {
    expect(keysOn("2026-12-16")).toEqual([]);
    expect(keysOn("2026-12-23")).toEqual([]);
  });

  it("skips the 7-day reminder when the period is shorter than a week", () => {
    const short = makeDeadline("short", "exam-registration", "2026-11-16", "2026-11-19");
    const keys = remindersDueOn([short], "2026-11-12").map((r) => r.key);
    expect(keys).toEqual([]);
  });
});
