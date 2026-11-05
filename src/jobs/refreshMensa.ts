import type { Api } from "grammy";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";
import { addDays } from "../lib/time.js";
import { fetchMeals } from "../services/mensa.js";
import { saveMenu } from "../services/mensaCache.js";
import { deliver } from "../services/notifier.js";

const DAYS_AHEAD = 4;

export type MensaRefreshSummary = { refreshed: string[]; failed: string[] };

export async function refreshMensa(api: Api, today: string): Promise<MensaRefreshSummary> {
  const refreshed: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = addDays(today, i);
    try {
      const meals = await fetchMeals(date);
      await saveMenu(date, meals);
      refreshed.push(date);
    } catch (err) {
      logger.error({ err, date }, "Mensa refresh failed");
      failed.push(date);
    }
  }

  if (failed.length > 0) {
    await deliver(
      api,
      config.ADMIN_CHAT_ID,
      `Mensa refresh failed for ${failed.join(", ")}. The last good menus are kept. Check the logs.`,
    );
  }

  logger.info({ refreshed, failed }, "Mensa refresh finished");
  return { refreshed, failed };
}
