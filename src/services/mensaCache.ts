import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { mensaDays } from "../db/schema.js";
import type { Meal } from "./mensa.js";

export type CachedMenu = typeof mensaDays.$inferSelect


export async function saveMenu(date: string, meals: Meal[]): Promise<void> {
  await db
  .insert(mensaDays)
  .values({ date, meals })
  .onConflictDoUpdate({
    target: mensaDays.date,
    set: { meals, fetchedAt: new Date() },
  });
}

export async function getMenu(date:string): Promise<CachedMenu | null >{
  const [row] = await db.select().from(mensaDays).where(eq(mensaDays.date, date));
  return row ?? null;
}
