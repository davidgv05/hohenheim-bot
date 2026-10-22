import type { CommandContext, Context } from "grammy";
import { upcomingDeadlines, type Deadline } from "../../services/deadlines.js";
import { formatDate, todayInBerlin } from "../../lib/time.js";

const MAX_SHOWN = 5;

export function formatDeadline(d: Deadline, today: string): string {
  const dates = d.end ? `${formatDate(d.start)} – ${formatDate(d.end)}` : formatDate(d.start);

  const notes: string[] = [];
  if (d.end && d.start <= today) notes.push("läuft gerade");
  if (!d.end && d.start === today) notes.push("heute");
  if (d.faculty === "W") notes.push("nur Fakultät W");

  const suffix = notes.length > 0 ? ` (${notes.join(", ")})` : "";
  return `• ${d.title}\n   ${dates}${suffix}`;
}

export async function deadlinesCommand(ctx: CommandContext<Context>, deadlines: Deadline[]) {
  const today = todayInBerlin();
  const upcoming = upcomingDeadlines(deadlines, today).slice(0, MAX_SHOWN);

  if (upcoming.length === 0) {
    await ctx.reply("Aktuell sind keine anstehenden Fristen eingetragen.");
    return;
  }

  const lines = upcoming.map((d) => formatDeadline(d, today));

  await ctx.reply(
    "Die nächsten Fristen:\n\n" +
      lines.join("\n\n") +
      "\n\nAlle Angaben ohne Gewähr. Für dezentral organisierte Prüfungen können abweichende Fristen gelten – maßgeblich ist der Studienplaner in HohCampus.\n" +
      "Quelle: https://www.uni-hohenheim.de/semestertermine",
    { link_preview_options: { is_disabled: true } },
  );
}
