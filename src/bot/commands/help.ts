import type { CommandContext, Context } from "grammy";
import { COMMANDS } from "../commandList.js";

export async function helpCommand(ctx: CommandContext<Context>) {
  const lines = COMMANDS.map((c) => `/${c.command} – ${c.description}`);
  await ctx.reply(`Verfügbare Befehle:\n${lines.join("\n")}`);
}
