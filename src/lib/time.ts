import { DateTime } from "luxon";

export const ZONE = "Europe/Berlin";

export function todayInBerlin(now: Date = new Date()): string {
  const today = DateTime.fromJSDate(now, { zone: ZONE }).toISODate();
  if (today === null) {
    throw new Error("Invalid date passed to todayInBerlin");
  }
  return today;
}

export function formatDate(isoDate: string): string {
  return DateTime.fromISO(isoDate, { zone: ZONE })
    .setLocale("de")
    .toFormat("EEE, dd.MM.yyyy");
}
