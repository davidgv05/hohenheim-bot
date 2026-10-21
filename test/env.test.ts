import { describe, it, expect } from "vitest";
import { envSchema } from "../src/lib/env.js";

const validEnv = {
  BOT_TOKEN: "123456:test-token",
  ADMIN_CHAT_ID: "987654321",
  DATABASE_URL: "postgres://bot:bot@localhost:5432/hohenheim_bot",
};

describe("envSchema", () => {
  it("accepts a valid environment", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("rejects a missing BOT_TOKEN", () => {
    const result = envSchema.safeParse({ ...validEnv, BOT_TOKEN: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects an empty ADMIN_CHAT_ID", () => {
    const result = envSchema.safeParse({ ...validEnv, ADMIN_CHAT_ID: "" });
    expect(result.success).toBe(false);
  });
});
