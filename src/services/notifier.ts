import { GrammyError, type Api } from "grammy";
import { logger } from "../lib/logger.js";

export type DeliveryResult = "sent" | "blocked" | "failed";

export async function deliver(api: Api, chatId: number, text: string): Promise<DeliveryResult> {
  try {
    await api.sendMessage(chatId, text, { link_preview_options: { is_disabled: true } });
    return "sent";
  } catch (err) {
    if (err instanceof GrammyError && err.error_code === 403) {
      return "blocked";
    }
    logger.error({ err, chatId }, "Failed to deliver message");
    return "failed";
  }
}

export function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
