import { GrammyError, InlineKeyboard, type CallbackQueryContext, type CommandContext, type Context } from "grammy";
import { deleteUser } from "../../services/users.js";
import { logger } from "../../lib/logger.js";

function confirmKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("Ja, alles löschen", "delete:confirm")
    .row()
    .text("Abbrechen", "delete:cancel");
}

export async function deleteCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    "Willst du wirklich alle Daten löschen, die der Bot über dich gespeichert hat?\n\n" +
      "Du bekommst danach keine Erinnerungen mehr. Deine Einstellungen gehen verloren.",
    { reply_markup: confirmKeyboard() },
  );
}

export async function deleteButton(ctx: CallbackQueryContext<Context>) {
  const chatId = ctx.chat?.id;
  const choice = ctx.callbackQuery.data;

  try {
    if (chatId === undefined) return;

    if (choice === "delete:cancel") {
      await ctx.editMessageText("Abgebrochen. Es wurde nichts gelöscht.");
      return;
    }

    if (choice === "delete:confirm") {
      const deleted = await deleteUser(chatId);
      logger.info({ deleted }, "User deleted their data");
      await ctx.editMessageText(
        deleted
          ? "Alle Daten über dich wurden gelöscht. Mit /start kannst du den Bot jederzeit wieder nutzen."
          : "Es waren keine Daten über dich gespeichert.",
      );
    }
  } catch (err) {
    const unchanged = err instanceof GrammyError && err.description.includes("message is not modified");
    if (!unchanged) {
      logger.error({ err }, "Failed to delete user");
      await ctx.reply("Das Löschen hat nicht geklappt. Bitte versuche es später noch einmal.");
    }
  } finally {
    await ctx.answerCallbackQuery();
  }
}
