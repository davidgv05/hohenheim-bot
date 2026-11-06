import { describe, it, expect } from "vitest";
import type { User } from "../src/services/users.js";
import { settingsKeyboard, settingsText } from "../src/bot/settingsView.js";

function makeUser(faculty: string | null, remindersEnabled = true): User {
  return { chatId: 1, faculty, language: "de", isActive: true, remindersEnabled, createdAt: new Date() };
}

function buttonTexts(user: User): string[] {
  return settingsKeyboard(user).inline_keyboard.flat().map((button) => button.text);
}

describe("settings screen", () => {
  it("shows the current settings", () => {
    const text = settingsText(makeUser("W", false));
    expect(text).toContain("Fakultät: Wirtschafts- und Sozialwissenschaften");
    expect(text).toContain("Erinnerungen: aus");
  });

  it("marks the chosen faculty", () => {
    const texts = buttonTexts(makeUser("W"));
    expect(texts).toContain("✓ Wirtschafts-/Sozialwiss.");
    expect(texts).toContain("Keine Angabe");
  });

  it("marks 'Keine Angabe' when no faculty is chosen", () => {
    expect(buttonTexts(makeUser(null))).toContain("✓ Keine Angabe");
  });

  it("offers the opposite of the current reminder state", () => {
    expect(buttonTexts(makeUser(null, true))).toContain("Erinnerungen ausschalten");
    expect(buttonTexts(makeUser(null, false))).toContain("Erinnerungen einschalten");
  });
});
