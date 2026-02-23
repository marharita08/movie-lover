import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useOtpCountdown } from "./useOtpCountdown";

describe("useOtpCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with 60 seconds", () => {
    const { result } = renderHook(() => useOtpCountdown());
    expect(result.current.secondsLeft).toBe(60);
  });

  it("isFinished is false initially", () => {
    const { result } = renderHook(() => useOtpCountdown());
    expect(result.current.isFinished).toBe(false);
  });

  it("decrements secondsLeft every second", () => {
    const { result } = renderHook(() => useOtpCountdown());

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(59);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(58);
  });

  it("reaches 0 after 60 seconds", () => {
    const { result } = renderHook(() => useOtpCountdown());

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(result.current.secondsLeft).toBe(0);
  });

  it("sets isFinished to true when secondsLeft reaches 0", () => {
    const { result } = renderHook(() => useOtpCountdown());

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(result.current.isFinished).toBe(true);
  });

  it("does not decrement below 0", () => {
    const { result } = renderHook(() => useOtpCountdown());

    act(() => {
      vi.advanceTimersByTime(65000);
    });

    expect(result.current.secondsLeft).toBe(0);
  });

  it("resets secondsLeft to 60", () => {
    const { result } = renderHook(() => useOtpCountdown());

    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(result.current.secondsLeft).toBe(30);

    act(() => {
      result.current.reset();
    });
    expect(result.current.secondsLeft).toBe(60);
  });

  it("resumes countdown after reset", () => {
    const { result } = renderHook(() => useOtpCountdown());

    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(result.current.isFinished).toBe(true);

    act(() => {
      result.current.reset();
    });
    expect(result.current.isFinished).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(59);
  });
});
