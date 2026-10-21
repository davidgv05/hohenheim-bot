import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { pool } from "./db/client.js";
import { createBot } from "./bot/bot.js";

try {
  await pool.query("select 1");
  logger.info("Database connection OK");
} catch (err) {
  logger.fatal({ err }, "Cannot connect to database – is Docker running?");
  process.exit(1);
}

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

await pool.end();
logger.info("Shut down cleanly");
