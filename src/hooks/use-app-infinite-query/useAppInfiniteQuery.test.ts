import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PaginatedResponse } from "@/types";

import { useAppInfiniteQuery } from "./useAppInfiniteQuery";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

const makePage = (
  page: number,
  totalPages: number,
): PaginatedResponse<{ id: number }> => ({
  results: [{ id: page }],
  page,
  totalPages,
  totalResults: totalPages * 10,
});

describe("useAppInfiniteQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches first page successfully", async () => {
    const { result } = renderHook(
      () =>
        useAppInfiniteQuery({
          queryKey: ["test"] as const,
          queryFn: () => Promise.resolve(makePage(1, 3)),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0]).toEqual(makePage(1, 3));
  });

  it("starts with initialPageParam of 1", async () => {
    const queryFn = vi.fn().mockResolvedValue(makePage(1, 3));

    const { result } = renderHook(
      () =>
        useAppInfiniteQuery({
          queryKey: ["test"] as const,
          queryFn,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ pageParam: 1 }),
    );
  });

  it("returns next page number when there are more pages", async () => {
    const { result } = renderHook(
      () =>
        useAppInfiniteQuery({
          queryKey: ["test"] as const,
          queryFn: () => Promise.resolve(makePage(1, 3)),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("returns undefined for next page when on last page", async () => {
    const { result } = renderHook(
      () =>
        useAppInfiniteQuery({
          queryKey: ["test"] as const,
          queryFn: () => Promise.resolve(makePage(3, 3)),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  it("fetches next page correctly", async () => {
    const queryFn = vi
      .fn()
      .mockResolvedValueOnce(makePage(1, 2))
      .mockResolvedValueOnce(makePage(2, 2));

    const { result } = renderHook(
      () =>
        useAppInfiniteQuery<{ id: number }>({
          queryKey: ["test"] as const,
          queryFn,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toHaveLength(1);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.data?.pages[1]).toEqual(makePage(2, 2));
    expect(result.current.hasNextPage).toBe(false);
  });
});
