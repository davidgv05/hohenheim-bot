import { z } from "zod";

export const CANTEEN_ID = 1765;
const BASE_URL = "https://openmensa.org/api/v2";
const TIMEOUT_MS = 10_000;

const mealSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  category: z.string(),
  prices: z.object({
    students: z.number().nullable().optional(),
  }),
  notes: z.array(z.string()).default([]),
});

export type Meal = z.infer<typeof mealSchema>;

const mealListSchema = z.array(mealSchema);

export function parseMeals(data: unknown): Meal[] {
  const result = mealListSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid OpenMensa response:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export async function fetchMeals(date: string, fetchFn: typeof fetch = fetch): Promise<Meal[]> {
  const url = `${BASE_URL}/canteens/${CANTEEN_ID}/days/${date}/meals`;
  const response = await fetchFn(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`OpenMensa answered ${response.status} for ${date}`);
  }

  return parseMeals(await response.json());
}


export function dietLabel(meal: Meal): "vegan" | "vegetarisch" | null {
  const notes = meal.notes.map((n) => n.toLowerCase());
  if (meal.category.toLowerCase().includes("vegan") || notes.includes("vegan")) {
    return "vegan";
  }
  if (notes.includes("vegetarisch")) {
    return "vegetarisch";
  }
  return null;
}
