import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "@/hooks";
import { HttpException } from "@/types";

import { useAppQuery } from "./useAppQuery";

vi.mock("@/hooks", () => ({
  toast: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useAppQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on success", async () => {
    const { result } = renderHook(
      () =>
        useAppQuery({
          queryKey: ["test"],
          queryFn: () => Promise.resolve({ id: 1 }),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 1 });
  });

  it("calls onError when query fails", async () => {
    const onError = vi.fn();
    const error = new Error("Something went wrong");

    const { result } = renderHook(
      () =>
        useAppQuery({
          queryKey: ["test"],
          queryFn: () => Promise.reject(error),
          onError,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("shows toast when error is HttpException and defaultErrorHandling is true", async () => {
    const error = new HttpException({ status: 400 } as Response, {
      message: "Bad request",
    });

    const { result } = renderHook(
      () =>
        useAppQuery({
          queryKey: ["test"],
          queryFn: () => Promise.reject(error),
          defaultErrorHandling: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast).toHaveBeenCalledWith({
      title: "Bad request",
      variant: "destructive",
    });
  });

  it("does not show toast when error is not HttpException", async () => {
    const error = new Error("Network error");

    const { result } = renderHook(
      () =>
        useAppQuery({
          queryKey: ["test"],
          queryFn: () => Promise.reject(error),
          defaultErrorHandling: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast).not.toHaveBeenCalled();
  });

  it("does not show toast when defaultErrorHandling is false", async () => {
    const error = new HttpException({ status: 400 } as Response, {
      message: "Bad request",
    });

    const { result } = renderHook(
      () =>
        useAppQuery({
          queryKey: ["test"],
          queryFn: () => Promise.reject(error),
          defaultErrorHandling: false,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast).not.toHaveBeenCalled();
  });

  it("calls onError and shows toast when defaultErrorHandling is true and error is HttpException", async () => {
    const onError = vi.fn();
    const error = new HttpException({ status: 400 } as Response, {
      message: "Bad request",
    });

    const { result } = renderHook(
      () =>
        useAppQuery({
          queryKey: ["test"],
          queryFn: () => Promise.reject(error),
          defaultErrorHandling: true,
          onError,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onError).toHaveBeenCalledWith(error);
    expect(toast).toHaveBeenCalledWith({
      title: "Bad request",
      variant: "destructive",
    });
  });
});
