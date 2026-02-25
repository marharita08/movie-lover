import { describe, expect, it } from "vitest";

import { getFallback } from "./get-fallback";

describe("getFallback", () => {
  it("returns ?? if name is undefined", () => {
    expect(getFallback(undefined)).toBe("??");
  });

  it("returns ?? if name is empty string", () => {
    expect(getFallback("")).toBe("??");
  });

  it("returns ?? if name is only whitespace", () => {
    expect(getFallback("   ")).toBe("??");
  });

  it("returns first letter uppercased for single word", () => {
    expect(getFallback("john")).toBe("J");
  });

  it("returns initials for full name", () => {
    expect(getFallback("John Doe")).toBe("JD");
  });

  it("returns initials for three word name", () => {
    expect(getFallback("John Michael Doe")).toBe("JMD");
  });

  it("returns uppercased initials even if name is lowercase", () => {
    expect(getFallback("john doe")).toBe("JD");
  });
});
