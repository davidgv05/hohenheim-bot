import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseMeals } from "../src/services/mensa.js";
import { formatMenu } from "../src/bot/mensaFormat.js";

const meals = parseMeals(
  JSON.parse(readFileSync(new URL("./fixtures/mensa-meals.json", import.meta.url), "utf8")),
);
const fetchedAt = new Date("2026-11-05T17:56:43Z");
const menu = { date: "2026-11-06", meals, fetchedAt };

describe("formatMenu", () => {
  it("shows meals with prices, labels and the time of the data", () => {
    const text = formatMenu("2026-11-06", menu, fetchedAt);
    expect(text).toContain("Mensa Hohenheim – Fr., 06.11.2026");
    expect(text).toContain("Tagesmenü vegan · 3,70");
    expect(text).toContain("Salat der Saison (vegan)");
    expect(text).toContain("Stand: 05.11., 18:56 Uhr");
    expect(text).not.toContain("veraltet");
  });

  it("marks data older than 26 hours as possibly outdated", () => {
    const twoDaysLater = new Date("2026-11-07T18:00:00Z");
    expect(formatMenu("2026-11-06", menu, twoDaysLater)).toContain("möglicherweise veraltet");
  });

  it("explains a day without meals", () => {
    const text = formatMenu("2026-11-07", { ...menu, meals: [] }, fetchedAt);
    expect(text).toContain("Kein Speiseplan");
  });

  it("explains a day that was never fetched", () => {
    expect(formatMenu("2026-11-20", null, fetchedAt)).toContain("noch kein Speiseplan");
  });
});
