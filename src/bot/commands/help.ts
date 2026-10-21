import type { CommandContext, Context } from "grammy";

export async function helpCommand(ctx: CommandContext<Context>) {
  await ctx.reply("Verfügbare Befehle:\n/start – Bot starten\n/help – Hilfe");
}
