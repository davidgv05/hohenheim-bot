import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { createBot } from "./bot/bot.js";

const bot = createBot();

await bot.api.setMyCommands([
  { command: "start", description: "Bot starten" },
  { command: "help", description: "Hilfe anzeigen" },
]);

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

logger.info({ env: config.NODE_ENV }, "Starting bot");
await bot.start({
  onStart: (me) => logger.info(`Bot @${me.username} is running`),
});
