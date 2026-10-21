import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BOT_TOKEN: z.string().min(1, "Missing – get it from @BotFather"),
  ADMIN_CHAT_ID: z
  .string()
  .regex(/^-?\d+$/, "Must be a numeric Telegram chat ID")
  .transform(Number),
  LOG_LEVEL: z
  .enum(["fatal", "error", "warn", "info", "debug", "trace"])
  .default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = parsed.data;
