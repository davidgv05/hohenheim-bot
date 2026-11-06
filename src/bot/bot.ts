import { mensaCommand, mensaButton } from "./commands/mensa.js";import { autoRetry } from "@grammyjs/auto-retry";
import { runRemindersCommand } from "./commands/admin.js";
import { Bot } from "grammy";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";
import type { Deadline } from "../services/deadlines.js";
import { startCommand } from "./commands/start.js";
import { helpCommand } from "./commands/help.js";
import { deadlinesCommand } from "./commands/deadlines.js";
import { settingsCommand, settingsButton } from "./commands/settings.js";



export function createBot(deadlines: Deadline[]) {
  const bot = new Bot(config.BOT_TOKEN);
  bot.api.config.use(autoRetry());

  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("settings", settingsCommand);
  bot.callbackQuery(/^settings:/, settingsButton);
  bot.command("deadlines", (ctx) => deadlinesCommand(ctx, deadlines));
  bot.command("runreminders", (ctx) => runRemindersCommand(ctx, deadlines));
  bot.command("mensa", mensaCommand);
  bot.callbackQuery(/^mensa:\d{4}-\d{2}-\d{2}$/, mensaButton);
  bot.catch((err) => {
    logger.error({ err: err.error, updateId: err.ctx.update.update_id }, "Unhandled bot error");
  });

  return bot;
}
