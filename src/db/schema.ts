import { pgTable, bigint, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  chatId: bigint("chat_id", { mode: "number" }).primaryKey(),
  faculty: text("faculty"),
  language: text("language").notNull().default("de"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
