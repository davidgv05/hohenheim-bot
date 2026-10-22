import type { Deadline } from "./deadlines.js";
import { addDays } from "../lib/time.js";

export type ReminderKind =
  | "opens-today"
  | "closes-in-7-days"
  | "closes-tomorrow"
  | "starts-in-7-days";

export type DueReminder = {
  deadline: Deadline;
  kind: ReminderKind;
  key: string;
};

type PlannedReminder = { kind: ReminderKind; date: string };

function plannedReminders(d: Deadline): PlannedReminder[] {
  const lastDay = d.end ?? d.start;

  switch (d.category) {
    case "exam-registration":
    case "re-registration": {
      const planned: PlannedReminder[] = [];
      if (d.end) {
        planned.push({ kind: "opens-today", date: d.start });
      }
      const weekBefore = addDays(lastDay, -7);
      if (!d.end || weekBefore >= d.start) {
        planned.push({ kind: "closes-in-7-days", date: weekBefore });
      }
      planned.push({ kind: "closes-tomorrow", date: addDays(lastDay, -1) });
      return planned;
    }
    case "exams":
      return [{ kind: "starts-in-7-days", date: addDays(d.start, -7) }];
    case "semester":
      return [];
  }
}

export function remindersDueOn(deadlines: Deadline[], today: string): DueReminder[] {
  return deadlines.flatMap((deadline) =>
    plannedReminders(deadline)
      .filter((r) => r.date === today)
      .map((r) => ({ deadline, kind: r.kind, key: `${deadline.id}:${r.kind}` })),
  );
}
