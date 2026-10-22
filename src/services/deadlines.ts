import { readFileSync } from "node:fs";
import { z } from "zod";
import { parse } from "yaml";

export const deadlineSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9-]+$/, "Only lowercase letters, digits and dashes"),
    title: z.string().min(1, "Must not be empty"),
    category: z.enum(["exam-registration", "exams", "semester", "re-registration"]),
    start: z.iso.date("Must be a real date in YYYY-MM-DD format"),
    end: z.iso.date("Must be a real date in YYYY-MM-DD format").optional(),
    faculty: z.enum(["all", "W"]),
    source: z.url(),
  })
  .refine((d) => d.end === undefined || d.end >= d.start, {
    message: "End date must not be before start date",
    path: ["end"],
  });

export type Deadline = z.infer<typeof deadlineSchema>;

const deadlineListSchema = z
  .array(deadlineSchema)
  .min(1, "The file must contain at least one deadline")
  .superRefine((list, ctx) => {
    const seen = new Set<string>();
    list.forEach((deadline, index) => {
      if (seen.has(deadline.id)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate id "${deadline.id}"`,
          path: [index, "id"],
        });
      }
      seen.add(deadline.id);
    });
  });

export function parseDeadlines(text: string): Deadline[] {
  const raw: unknown = parse(text);
  const result = deadlineListSchema.safeParse(raw);

  if (!result.success) {
    throw new Error(`Invalid deadlines file:\n${z.prettifyError(result.error)}`);
  }

  return result.data.toSorted((a, b) => a.start.localeCompare(b.start));
}


const DEADLINES_FILE = new URL("../../data/deadlines.yaml", import.meta.url);

export function loadDeadlines(): Deadline[] {
  const text = readFileSync(DEADLINES_FILE, "utf8");
  return parseDeadlines(text);
}



export function upcomingDeadlines(deadlines: Deadline[], today: string): Deadline[] {
  return deadlines.filter((d) => (d.end ?? d.start) >= today);
}
