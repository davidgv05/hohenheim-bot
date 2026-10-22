import type { CommandContext, Context } from "grammy";

export async function helpCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    "Verfügbare Befehle:\n" +
      "/deadlines – Nächste Fristen anzeigen\n" +
      "/start – Bot starten\n" +
      "/help – Hilfe",
  );
}
