import { describe, expect, it } from "vitest";

import { formatRuntime } from "./format-runtime";

describe("formatRuntime", () => {
  it("returns empty string if minutes is null", () => {
    expect(formatRuntime(null)).toBe("");
  });

  it("returns empty string if minutes is 0", () => {
    expect(formatRuntime(0)).toBe("");
  });

  it("formats minutes only when less than 60", () => {
    expect(formatRuntime(45)).toBe("45min");
  });

  it("formats exactly one hour", () => {
    expect(formatRuntime(60)).toBe("1h 0min");
  });

  it("formats hours and minutes", () => {
    expect(formatRuntime(125)).toBe("2h 5min");
  });
});
