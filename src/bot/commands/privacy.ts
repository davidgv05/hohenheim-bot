import type { CommandContext, Context } from "grammy";

const PRIVACY_TEXT =
  "Datenschutz\n\n" +
  "Gespeichert wird nur, was der Bot zum Funktionieren braucht:\n" +
  "• deine Telegram-Chat-ID (damit er dir Erinnerungen schicken kann)\n" +
  "• deine Einstellungen: Fakultät und ob Erinnerungen an sind\n" +
  "• wann du den Bot gestartet hast und ob er dich erreichen kann\n" +
  "• welche Erinnerungen du schon bekommen hast (damit keine doppelt kommt)\n\n" +
  "Nicht gespeichert werden: dein Name, dein Benutzername, deine Telefonnummer und der Inhalt deiner Nachrichten.\n\n" +
  "Fehlerprotokolle können deine Chat-ID enthalten. Sicherungskopien der Datenbank werden nach 7 Tagen gelöscht.\n\n" +
  "Die Daten werden nicht weitergegeben. Dies ist ein inoffizielles Projekt, kein Angebot der Universität Hohenheim.\n\n" +
  "Mit /delete löschst du alle Daten über dich.";

export async function privacyCommand(ctx: CommandContext<Context>) {
  await ctx.reply(PRIVACY_TEXT);
}
