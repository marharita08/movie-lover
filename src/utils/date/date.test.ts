import { describe, expect, it } from "vitest";

import { formatDate } from "./date";

describe("formatDate", () => {
  it("returns empty string if dateString is empty", () => {
    expect(formatDate("")).toBe("");
  });

  it("returns empty string if dateString is invalid", () => {
    expect(formatDate("invalid-date")).toBe("");
  });

  it("formats valid date correctly", () => {
    expect(formatDate("2024-01-15")).toBe("15 Jan 2024");
  });

  it("formats date with correct day padding", () => {
    expect(formatDate("2024-03-05")).toBe("05 Mar 2024");
  });

  it("formats date in december correctly", () => {
    expect(formatDate("2023-12-31")).toBe("31 Dec 2023");
  });
});
