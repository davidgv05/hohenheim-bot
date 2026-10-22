import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";


export type User = typeof users.$inferSelect;


export async function registerUser(chatId : number): Promise<User>{

  const [user] = await db.insert(users).values({chatId}).onConflictDoUpdate({target : users.chatId, set: {isActive:true}}).returning()

  if(!user) {throw new Error (`Upsert for chat ${chatId} returned no row`)}

  return user

}


export async function getActiveUsers(): Promise<User[]> {
  return db.select().from(users).where(eq(users.isActive, true));
}

export async function deactivateUser(chatId: number): Promise<void> {
  await db.update(users).set({ isActive: false }).where(eq(users.chatId, chatId));
}
