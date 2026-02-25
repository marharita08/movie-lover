import { describe, expect, it } from "vitest";

import { formatFileSize } from "./format-file-size";

describe("formatFileSize", () => {
  it('returns "0 Bytes" if bytes is 0', () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
  });

  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 Bytes");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1 GB");
  });

  it("formats with default 2 decimals", () => {
    expect(formatFileSize(1500)).toBe("1.46 KB");
  });

  it("formats with custom decimals", () => {
    expect(formatFileSize(1500, 0)).toBe("1 KB");
  });

  it("handles negative decimals as 0", () => {
    expect(formatFileSize(1500, -1)).toBe("1 KB");
  });
});
