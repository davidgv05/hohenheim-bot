import { describe, it, expect } from "vitest";
import { facultyName, isFacultyCode } from "../src/lib/faculties.js";

describe("faculties", () => {
  it("recognizes the three faculty codes", () => {
    expect(isFacultyCode("W")).toBe(true);
    expect(isFacultyCode("X")).toBe(false);
  });

  it("names a faculty, or says none was chosen", () => {
    expect(facultyName("W")).toBe("Wirtschafts- und Sozialwissenschaften");
    expect(facultyName(null)).toBe("keine Angabe");
  });
});
