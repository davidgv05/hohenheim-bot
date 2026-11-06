import { InlineKeyboard } from "grammy";
import type { User } from "../services/users.js";
import { facultyName, type FacultyCode } from "../lib/faculties.js";

const FACULTY_BUTTONS: { code: FacultyCode; label: string }[] = [
  { code: "A", label: "Agrarwiss." },
  { code: "N", label: "Naturwiss." },
  { code: "W", label: "Wirtschafts-/Sozialwiss." },
];

function mark(label: string, selected: boolean): string {
  return selected ? `✓ ${label}` : label;
}

export function settingsText(user: User): string {
  return (
    "Einstellungen\n\n" +
    `Fakultät: ${facultyName(user.faculty)}\n` +
    `Erinnerungen: ${user.remindersEnabled ? "an" : "aus"}\n\n` +
    "Mit deiner Fakultät bekommst du nur Fristen, die für dich gelten."
  );
}

export function settingsKeyboard(user: User): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const { code, label } of FACULTY_BUTTONS) {
    keyboard.text(mark(label, user.faculty === code), `settings:faculty:${code}`);
  }
  keyboard.row();
  keyboard.text(mark("Keine Angabe", user.faculty === null), "settings:faculty:none");
  keyboard.row();
  keyboard.text(
    user.remindersEnabled ? "Erinnerungen ausschalten" : "Erinnerungen einschalten",
    `settings:reminders:${user.remindersEnabled ? "off" : "on"}`,
  );

  return keyboard;
}
