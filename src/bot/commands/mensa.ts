import {
  GrammyError,
  InlineKeyboard,
  type CallbackQueryContext,
  type CommandContext,
  type Context,
} from "grammy";
import { getMenu } from "../../services/mensaCache.js";
import { formatMenu } from "../mensaFormat.js";
import { formatDate, nextWeekday, todayInBerlin } from "../../lib/time.js";
import { logger } from "../../lib/logger.js";

function mensaKeyboard(): InlineKeyboard {
  const today = todayInBerlin();
  const next = nextWeekday(today);
  return new InlineKeyboard()
    .text("Heute", `mensa:${today}`)
    .text(formatDate(next), `mensa:${next}`);
}

async function menuText(date: string): Promise<string> {
  const menu = await getMenu(date);
  return formatMenu(date, menu, new Date());
}

export async function mensaCommand(ctx: CommandContext<Context>) {
  try {
    await ctx.reply(await menuText(todayInBerlin()), {
      reply_markup: mensaKeyboard(),
      link_preview_options: { is_disabled: true },
    });
  } catch (err) {
    logger.error({ err }, "Failed to show Mensa menu");
    await ctx.reply("Der Speiseplan ist gerade nicht verfügbar. Bitte versuche es später noch einmal.");
  }
}

export async function mensaButton(ctx: CallbackQueryContext<Context>) {
  const date = ctx.callbackQuery.data.slice("mensa:".length);
  try {
    await ctx.editMessageText(await menuText(date), {
      reply_markup: mensaKeyboard(),
      link_preview_options: { is_disabled: true },
    });
  } catch (err) {
    const unchanged = err instanceof GrammyError && err.description.includes("message is not modified");
    if (!unchanged) {
      logger.error({ err, date }, "Failed to switch Mensa day");
    }
  } finally {
    await ctx.answerCallbackQuery();
  }
}
