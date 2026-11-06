import type { CommandContext, Context } from "grammy";

export async function helpCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    "Verfügbare Befehle:\n" +
      "/start – Bot starten\n" +
      "/deadlines – Nächste Fristen anzeigen\n" +
      "/mensa – Mensa-Speiseplan anzeigen\n" +
      "/help – Hilfe",
  );
}
