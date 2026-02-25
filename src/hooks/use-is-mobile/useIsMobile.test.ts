import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "./useIsMobile";

describe("useIsMobile", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false when window width is >= 768", () => {
    vi.stubGlobal("innerWidth", 768);
    const { result } = renderHook(() => useIsMobile());

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(false);
  });

  it("returns true when window width is < 768", () => {
    vi.stubGlobal("innerWidth", 767);
    const { result } = renderHook(() => useIsMobile());

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);
  });

  it("updates value on resize", () => {
    vi.stubGlobal("innerWidth", 1024);
    const { result } = renderHook(() => useIsMobile());

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.stubGlobal("innerWidth", 375);
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);
  });

  it("does not update immediately on resize before debounce delay", () => {
    vi.stubGlobal("innerWidth", 1024);
    const { result } = renderHook(() => useIsMobile());

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      vi.stubGlobal("innerWidth", 375);
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toBe(false);
  });

  it("removes resize listener on unmount", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
