import type { CachedMenu } from "../services/mensaCache.js";
import { dietLabel, type Meal } from "../services/mensa.js";
import { formatDate, formatDateTime } from "../lib/time.js";

const STALE_AFTER_MS = 26 * 60 * 60 * 1000;
const priceFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function formatMeal(meal: Meal): string {
  const price =
    meal.prices.students != null ? ` · ${priceFormat.format(meal.prices.students)}` : "";
  const label = dietLabel(meal);
  const suffix = label ? ` (${label})` : "";
  return `• ${meal.category}${price}\n   ${meal.name}${suffix}`;
}

export function formatMenu(date: string, menu: CachedMenu | null, now: Date): string {
  const header = `Mensa Hohenheim – ${formatDate(date)}`;

  if (menu === null) {
    return `${header}\n\nFür diesen Tag liegt noch kein Speiseplan vor.`;
  }
  if (menu.meals.length === 0) {
    return `${header}\n\nKein Speiseplan – die Mensa ist geschlossen, oder der Plan ist noch nicht veröffentlicht.`;
  }

  const isStale = now.getTime() - menu.fetchedAt.getTime() > STALE_AFTER_MS;
  const staleNote = isStale ? " (möglicherweise veraltet)" : "";

  return (
    `${header}\n\n` +
    menu.meals.map(formatMeal).join("\n\n") +
    `\n\nPreise für Studierende. Stand: ${formatDateTime(menu.fetchedAt)}${staleNote}\n` +
    "Allergene und Zusatzstoffe: siehe Speiseplan des Studierendenwerks (my-stuwe.de)"
  );
}
