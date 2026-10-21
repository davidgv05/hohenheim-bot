import type { CommandContext, Context } from "grammy";
import { registerUser } from "../../services/users.js";
import { logger } from "../../lib/logger.js";

export async function startCommand(ctx: CommandContext<Context>) {
  const chatId = ctx.chat.id


  try {
    await registerUser(chatId);
  } catch (err) {
    logger.error({ err, chatId }, "Failed to register user");
    await ctx.reply("Da ist etwas schiefgelaufen. Bitte versuche es später noch einmal.");
    return;
  }

  await ctx.reply(
    "Hallo! Ich erinnere dich an Fristen der Uni Hohenheim und zeige dir den Mensa-Speiseplan.\n\n" +
      "Hinweis: Dies ist ein inoffizieller Bot. Maßgeblich sind immer die Angaben der Universität.\n\n" +
      "Tippe /help für alle Befehle."
  );
}
