import { describe, it, expect } from "vitest";
import type { User } from "../src/services/users.js";
import { remindersDueOn, isRecipient, formatReminder } from "../src/services/reminders.js";
import type { Deadline } from "../src/services/deadlines.js";

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




function makeUser(faculty: string | null, isActive = true, remindersEnabled = true): User {
  return { chatId: 1, faculty, language: "de", isActive, remindersEnabled, createdAt: new Date() };
}

const wOnly: Deadline = { ...exams, faculty: "W" };

describe("isRecipient", () => {
  it("sends deadlines for all faculties to every active user", () => {
    expect(isRecipient(makeUser(null), exams)).toBe(true);
    expect(isRecipient(makeUser("A"), exams)).toBe(true);
  });

  it("never sends to users who turned reminders off", () => {
    expect(isRecipient(makeUser(null, true, false), exams)).toBe(false);
  });

  it("sends Fakultät W deadlines to W users and to users without a faculty", () => {
    expect(isRecipient(makeUser("W"), wOnly)).toBe(true);
    expect(isRecipient(makeUser(null), wOnly)).toBe(true);
    expect(isRecipient(makeUser("A"), wOnly)).toBe(false);
  });

  it("never sends to inactive users", () => {
    expect(isRecipient(makeUser(null, false), exams)).toBe(false);
  });
});

describe("formatReminder", () => {
  it("names the deadline and its period when it opens", () => {
    const text = formatReminder({ deadline: registration, kind: "opens-today", key: "reg:opens-today" });
    expect(text).toContain("Ab heute: Test");
    expect(text).toContain("Mo., 16.11.2026 – Mi., 16.12.2026");
  });

  it("names the last day before it closes", () => {
    const text = formatReminder({ deadline: registration, kind: "closes-tomorrow", key: "reg:closes-tomorrow" });
    expect(text).toContain("Morgen ist der letzte Tag: Test");
    expect(text).toContain("Mi., 16.12.2026");
  });
});
