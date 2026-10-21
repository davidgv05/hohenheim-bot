import { Bot } from "grammy";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";
import { startCommand } from "./commands/start.js";
import { helpCommand } from "./commands/help.js";

export function createBot() {
  const bot = new Bot(config.BOT_TOKEN);

  bot.command("start", startCommand);
  bot.command("help", helpCommand);

  bot.catch((err) => {
    logger.error({ err: err.error, updateId: err.ctx.update.update_id }, "Unhandled bot error");
  });

  return bot;
}
