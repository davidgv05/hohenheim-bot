import { startJobs } from "./jobs/worker.js";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { pool } from "./db/client.js";
import { loadDeadlines, type Deadline } from "./services/deadlines.js";
import { createBot } from "./bot/bot.js";

let deadlines: Deadline[];
try {
  deadlines = loadDeadlines();
  logger.info({ count: deadlines.length }, "Deadlines loaded");
} catch (err) {
  logger.fatal({ err }, "Cannot load deadlines – check data/deadlines.yaml");
  process.exit(1);
}

try {
  await pool.query("select 1");
  logger.info("Database connection OK");
} catch (err) {
  logger.fatal({ err }, "Cannot connect to database – is Docker running?");
  process.exit(1);
}

const bot = createBot(deadlines);

await bot.api.setMyCommands([
  { command: "start", description: "Bot starten" },
  { command: "deadlines", description: "Nächste Fristen anzeigen" },
  { command: "help", description: "Hilfe anzeigen" },
  { command: "mensa", description: "Mensa-Speiseplan anzeigen" },
]);

let boss;
try {
  boss = await startJobs(bot.api, deadlines);
} catch (err) {
  logger.fatal({ err }, "Cannot start job queue");
  process.exit(1);
}

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

logger.info({ env: config.NODE_ENV }, "Starting bot");
await bot.start({
  onStart: (me) => logger.info(`Bot @${me.username} is running`),
});

  await boss.stop();
  await pool.end();
  logger.info("Shut down cleanly");
