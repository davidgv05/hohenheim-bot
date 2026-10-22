import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { remindersSent } from "../db/schema.js";

export async function claimReminder(chatId: number, reminderKey: string): Promise<boolean> {
  const inserted = await db
    .insert(remindersSent)
    .values({ chatId, reminderKey })
    .onConflictDoNothing()
    .returning();

  return inserted.length > 0;
}

export async function releaseReminder(chatId: number, reminderKey: string): Promise<void> {
  await db
    .delete(remindersSent)
    .where(and(eq(remindersSent.chatId, chatId), eq(remindersSent.reminderKey, reminderKey)));
}
