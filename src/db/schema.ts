import { pgTable, bigint, text, boolean, timestamp, primaryKey, date, jsonb } from "drizzle-orm/pg-core";
import type { Meal } from "../services/mensa.js";

export const users = pgTable("users", {
  chatId: bigint("chat_id", { mode: "number" }).primaryKey(),
  faculty: text("faculty"),
  language: text("language").notNull().default("de"),
  isActive: boolean("is_active").notNull().default(true),
  remindersEnabled: boolean("reminders_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


export const remindersSent = pgTable(
  "reminders_sent",
  {
    chatId: bigint("chat_id", { mode: "number" })
    .notNull()
    .references(() => users.chatId, { onDelete: "cascade" }),
      reminderKey: text("reminder_key").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.chatId, table.reminderKey] })],
);


export const mensaDays = pgTable("mensa_days", {
    date: date("date", { mode: "string" }).primaryKey(),
    meals: jsonb("meals").$type<Meal[]>().notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
  });
