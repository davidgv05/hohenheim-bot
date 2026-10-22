import { PgBoss } from "pg-boss";
import type { Api } from "grammy";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";
import { todayInBerlin, ZONE } from "../lib/time.js";
import type { Deadline } from "../services/deadlines.js";
import { sendDueReminders } from "./sendReminders.js";

const SEND_REMINDERS = "send-reminders";

export async function startJobs(api: Api, deadlines: Deadline[]): Promise<PgBoss> {
  const boss = new PgBoss(config.DATABASE_URL);

  boss.on("error", (err) => {
    logger.error({ err }, "Job queue error");
  });

  await boss.start();

  await boss.createQueue(SEND_REMINDERS, { retryLimit: 3, retryDelay: 300 });

  await boss.schedule(SEND_REMINDERS, "0 8 * * *", null, { tz: ZONE, missed: "once" });

  await boss.work(SEND_REMINDERS, async () => {
    const today = todayInBerlin();
    const summary = await sendDueReminders(api, deadlines, today);
    if (summary.failed > 0) {
      throw new Error(`${summary.failed} reminder(s) failed – retrying`);
    }
  });

  logger.info("Job queue started: send-reminders daily at 08:00 Europe/Berlin");
  return boss;
}
