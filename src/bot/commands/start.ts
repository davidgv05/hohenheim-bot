import type { CommandContext, Context } from "grammy";

export async function startCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    "Hallo! Ich erinnere dich an Fristen der Uni Hohenheim und zeige dir den Mensa-Speiseplan.\n\n" +
      "Hinweis: Dies ist ein inoffizieller Bot. Maßgeblich sind immer die Angaben der Universität.\n\n" +
      "Tippe /help für alle Befehle."
  );
}
