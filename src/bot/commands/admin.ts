import type { CommandContext, Context } from "grammy";
import { z } from "zod";
import { config } from "../../config.js";
import { logger } from "../../lib/logger.js";
import { todayInBerlin } from "../../lib/time.js";
import type { Deadline } from "../../services/deadlines.js";
import { sendDueReminders } from "../../jobs/sendReminders.js";

const dateSchema = z.iso.date();

export async function runRemindersCommand(ctx: CommandContext<Context>, deadlines: Deadline[]) {
  if (ctx.chat.id !== config.ADMIN_CHAT_ID) return;

  const arg = ctx.match.trim();
  const date = arg === "" ? todayInBerlin() : arg;

  if (!dateSchema.safeParse(date).success) {
    await ctx.reply("Usage: /runreminders or /runreminders YYYY-MM-DD");
    return;
  }

  await ctx.reply(`Running reminders for ${date} …`);

  try {
    const s = await sendDueReminders(ctx.api, deadlines, date);
    await ctx.reply(
      `Done for ${date}:\n` +
        `due: ${s.due}\n` +
        `sent: ${s.sent}\n` +
        `skipped: ${s.skipped}\n` +
        `blocked: ${s.blocked}\n` +
        `failed: ${s.failed}`,
    );
  } catch (err) {
    logger.error({ err, date }, "Manual reminder run failed");
    await ctx.reply("Reminder run failed – see logs.");
  }
}
