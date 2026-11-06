export const FACULTIES = {
  A: "Agrarwissenschaften",
  N: "Naturwissenschaften",
  W: "Wirtschafts- und Sozialwissenschaften",
} as const;

export type FacultyCode = keyof typeof FACULTIES;

export function isFacultyCode(value: string): value is FacultyCode {
  return value in FACULTIES;
}

export function facultyName(code: string | null): string {
  return code !== null && isFacultyCode(code) ? FACULTIES[code] : "keine Angabe";
}
