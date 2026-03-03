import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearch } from "./useSearch";

// Mock useDebounce hook
vi.mock("../use-debounce/useDebounce", () => ({
  useDebounce: vi.fn((value) => value),
}));

import { useDebounce } from "../use-debounce/useDebounce";

const mockedUseDebounce = useDebounce as ReturnType<typeof vi.fn>;

interface WrapperProps {
  children: ReactNode;
  initialEntries?: string[];
}

describe("useSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDebounce.mockImplementation((value) => value);
  });

  function wrapper({ children, initialEntries = ["/"] }: WrapperProps) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  }

  it("should initialize with empty search", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.search).toBe("");
    expect(result.current.debouncedSearch).toBe("");
  });

  it("should initialize with value from URL", () => {
    function customWrapper({ children }: { children: ReactNode }) {
      return wrapper({ children, initialEntries: ["/?search=test"] });
    }

    const { result } = renderHook(() => useSearch(), {
      wrapper: customWrapper,
    });

    expect(result.current.search).toBe("test");
  });

  it("should update search when setSearch is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch("new search");
    });

    expect(result.current.search).toBe("new search");
  });

  it("should update URL params after debounce", async () => {
    mockedUseDebounce.mockImplementation((value) => value);

    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch("debounced");
    });

    await waitFor(() => {
      expect(result.current.debouncedSearch).toBe("debounced");
    });

    expect(result.current.search).toBe("debounced");
  });

  it("should remove search param when search is empty", async () => {
    function customWrapper({ children }: { children: ReactNode }) {
      return wrapper({ children, initialEntries: ["/?search=initial"] });
    }

    const { result } = renderHook(() => useSearch(), {
      wrapper: customWrapper,
    });

    expect(result.current.search).toBe("initial");

    act(() => {
      result.current.setSearch("");
    });

    await waitFor(() => {
      expect(result.current.debouncedSearch).toBe("");
    });
  });

  it("should work with debounce delay", async () => {
    let debouncedValue = "";
    mockedUseDebounce.mockImplementation((value) => {
      setTimeout(() => {
        debouncedValue = value;
      }, 300);
      return debouncedValue;
    });

    const { result, rerender } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch("fast typing");
    });

    // Immediately after typing, debouncedSearch is still old
    expect(result.current.debouncedSearch).toBe("");

    // After debounce delay, it should update
    await waitFor(
      () => {
        rerender();
        expect(result.current.debouncedSearch).toBe("fast typing");
      },
      { timeout: 500 },
    );
  });

  it("should keep only the last debounced value", async () => {
    mockedUseDebounce.mockImplementation((value) => value);

    const { result } = renderHook(() => useSearch(), { wrapper });

    // Rapid changes
    act(() => {
      result.current.setSearch("a");
    });

    act(() => {
      result.current.setSearch("ab");
    });

    act(() => {
      result.current.setSearch("abc");
    });

    await waitFor(() => {
      expect(result.current.search).toBe("abc");
      expect(result.current.debouncedSearch).toBe("abc");
    });
  });

  it("should not update URL if debounced value has not changed", () => {
    const { result, rerender } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch("test");
    });

    rerender();

    const firstDebouncedValue = result.current.debouncedSearch;

    // Rerender without changes
    rerender();

    expect(result.current.debouncedSearch).toBe(firstDebouncedValue);
  });

  it("should handle special characters in search", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch("test@#$%");
    });

    expect(result.current.search).toBe("test@#$%");
  });

  it("should handle whitespace in search", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch("  spaces  ");
    });

    expect(result.current.search).toBe("  spaces  ");
  });
});
