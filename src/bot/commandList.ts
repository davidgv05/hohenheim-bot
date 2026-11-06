import type { BotCommand } from "grammy/types";

export const COMMANDS: BotCommand[] = [
  { command: "deadlines", description: "Nächste Fristen anzeigen" },
  { command: "mensa", description: "Mensa-Speiseplan anzeigen" },
  { command: "start", description: "Bot starten" },
  { command: "help", description: "Hilfe anzeigen" },
];
