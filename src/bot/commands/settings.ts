import { GrammyError, type CallbackQueryContext, type CommandContext, type Context } from "grammy";
import { getUser, registerUser, setFaculty, setRemindersEnabled } from "../../services/users.js";
import { isFacultyCode } from "../../lib/faculties.js";
import { settingsKeyboard, settingsText } from "../settingsView.js";
import { logger } from "../../lib/logger.js";

export async function settingsCommand(ctx: CommandContext<Context>) {
  try {
    const user = await registerUser(ctx.chat.id);
    await ctx.reply(settingsText(user), { reply_markup: settingsKeyboard(user) });
  } catch (err) {
    logger.error({ err, chatId: ctx.chat.id }, "Failed to show settings");
    await ctx.reply("Die Einstellungen sind gerade nicht verfügbar. Bitte versuche es später noch einmal.");
  }
}

export async function settingsButton(ctx: CallbackQueryContext<Context>) {
  const chatId = ctx.chat?.id;
  const [, setting, value] = ctx.callbackQuery.data.split(":");
  let notice: string | undefined;

  try {
    if (chatId === undefined) return;

    if (setting === "faculty" && value !== undefined) {
      if (value === "none") {
        await setFaculty(chatId, null);
      } else if (isFacultyCode(value)) {
        await setFaculty(chatId, value);
      }
    } else if (setting === "reminders") {
      await setRemindersEnabled(chatId, value === "on");
    }

    const user = await getUser(chatId);
    if (user === null) {
      notice = "Bitte sende zuerst /start.";
      return;
    }

    notice = "Gespeichert";
    await ctx.editMessageText(settingsText(user), { reply_markup: settingsKeyboard(user) });
  } catch (err) {
    const unchanged = err instanceof GrammyError && err.description.includes("message is not modified");
    if (!unchanged) {
      notice = "Das hat nicht geklappt. Bitte versuche es noch einmal.";
      logger.error({ err, chatId }, "Failed to change settings");
    }
  } finally {
    await ctx.answerCallbackQuery(notice);
  }
}
