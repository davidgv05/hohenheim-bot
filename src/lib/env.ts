import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BOT_TOKEN: z.string().min(1, "Missing – get it from @BotFather"),
  ADMIN_CHAT_ID: z
    .string()
    .regex(/^-?\d+$/, "Must be a numeric Telegram chat ID")
    .transform(Number),
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "Must be a postgres:// connection string"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});
