import { DateTime } from "luxon";
import { ZodNativeEnum } from "zod/v3";

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


export function addDays(isoDate: string, days: number): string {
  const result = DateTime.fromISO(isoDate, { zone: ZONE }).plus({ days }).toISODate();
  if (result === null) {
    throw new Error(`Invalid date passed to addDays: ${isoDate}`);
  }
  return result;
}


export function nextWeekday(isoDate: string): string {
  let day = DateTime.fromISO(isoDate, { zone: ZONE }).plus({ days: 1 });
  while (day.weekday > 5) {
    day = day.plus({ days: 1 });
  }
  const result = day.toISODate();
  if (result === null) {
    throw new Error(`Invalid date passed to nextWeekday(): ${isoDate}`);
  }
  return result;
}

export function formatDateTime(moment: Date): string {
  return DateTime.fromJSDate(moment, { zone: ZONE })
    .setLocale("de")
    .toFormat("dd.MM., HH:mm 'Uhr'");
}
