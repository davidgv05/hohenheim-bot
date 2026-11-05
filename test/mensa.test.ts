import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseMeals, fetchMeals } from "../src/services/mensa.js";

const fixture: unknown = JSON.parse(
  readFileSync(new URL("./fixtures/mensa-meals.json", import.meta.url), "utf8"),
);

function fakeFetch(status: number, body: unknown): typeof fetch {
  return async () => new Response(JSON.stringify(body), { status });
}

describe("parseMeals", () => {
  it("reads a real OpenMensa response", () => {
    const meals = parseMeals(fixture);
    expect(meals.length).toBe(6);
    expect(meals[0]?.category).toBe("Tagesmenü vegan");
    expect(meals[0]?.prices.students).toBe(3.7);
  });

  it("rejects a meal without a name", () => {
    expect(() => parseMeals([{ id: 1, category: "Tagesmenü", prices: {}, notes: [] }])).toThrow(
      "Invalid OpenMensa response",
    );
  });
});

describe("fetchMeals", () => {
  it("returns the meals on 200", async () => {
    const meals = await fetchMeals("2026-11-06", fakeFetch(200, fixture));
    expect(meals.length).toBe(6);
  });

  it("returns an empty list on 404 (no menu that day)", async () => {
    const meals = await fetchMeals("2026-11-07", fakeFetch(404, {}));
    expect(meals).toEqual([]);
  });

  it("throws on a server error", async () => {
    await expect(fetchMeals("2026-11-06", fakeFetch(500, {}))).rejects.toThrow("500");
  });
});
