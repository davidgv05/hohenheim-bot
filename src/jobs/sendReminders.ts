import type { Api } from "grammy";
import type { Deadline } from "../services/deadlines.js";
import { remindersDueOn, isRecipient, formatReminder } from "../services/reminders.js";
import { claimReminder, releaseReminder } from "../services/remindersSent.js";
import { getActiveUsers, deactivateUser } from "../services/users.js";
import { deliver, pause } from "../services/notifier.js";
import { logger } from "../lib/logger.js";

const DELAY_BETWEEN_MESSAGES_MS = 40;

export type ReminderRunSummary = {
  due: number;
  sent: number;
  skipped: number;
  blocked: number;
  failed: number;
};

export async function sendDueReminders(
  api: Api,
  deadlines: Deadline[],
  today: string,
): Promise<ReminderRunSummary> {
  const dueReminders = remindersDueOn(deadlines, today);
  const summary: ReminderRunSummary = {
    due: dueReminders.length,
    sent: 0,
    skipped: 0,
    blocked: 0,
    failed: 0,
  };

  if (dueReminders.length === 0) {
    logger.info({ today }, "No reminders due");
    return summary;
  }

  const recipients = await getActiveUsers();

  for (const reminder of dueReminders) {
    const text = formatReminder(reminder);

    for (const user of recipients) {
      if (!isRecipient(user, reminder.deadline)) continue;

      const claimed = await claimReminder(user.chatId, reminder.key);
      if (!claimed) {
        summary.skipped++;
        continue;
      }

      const result = await deliver(api, user.chatId, text);

      if (result === "sent") {
        summary.sent++;
      } else if (result === "blocked") {
        summary.blocked++;
        await deactivateUser(user.chatId);
        user.isActive = false;
      } else {
        summary.failed++;
        await releaseReminder(user.chatId, reminder.key);
      }

      await pause(DELAY_BETWEEN_MESSAGES_MS);
    }
  }

  logger.info({ today, ...summary }, "Reminder run finished");
  return summary;
}
