import type { Deadline } from "./deadlines.js";
import type { User } from "./users.js";
import { addDays, formatDate} from "../lib/time.js";

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




export function isRecipient(user: User, deadline: Deadline): boolean {
  if (!user.isActive) return false;
  if (deadline.faculty === "all") return true;
  return user.faculty === null || user.faculty === deadline.faculty;
}

function headline(reminder: DueReminder): string {
  const { deadline, kind } = reminder;
  const lastDay = formatDate(deadline.end ?? deadline.start);
  const period = deadline.end
    ? `${formatDate(deadline.start)} – ${formatDate(deadline.end)}`
    : formatDate(deadline.start);

  switch (kind) {
    case "opens-today":
      return `Ab heute: ${deadline.title}\nZeitraum: ${period}`;
    case "closes-in-7-days":
      return `Noch 7 Tage: ${deadline.title}\nLetzter Tag: ${lastDay}`;
    case "closes-tomorrow":
      return `Morgen ist der letzte Tag: ${deadline.title}\nLetzter Tag: ${lastDay}`;
    case "starts-in-7-days":
      return `In 7 Tagen beginnt: ${deadline.title}\nZeitraum: ${period}`;
  }
}

export function formatReminder(reminder: DueReminder): string {
  return (
    `${headline(reminder)}\n\n` +
    "Maßgeblich sind die Angaben der Universität und der Studienplaner in HohCampus.\n" +
    "Alle Fristen: /deadlines"
  );
}
