import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "@/hooks";
import { HttpException } from "@/types";

import { useAppMutation } from "./useAppMutation";

vi.mock("@/hooks", () => ({
  toast: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useAppMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls mutate success", async () => {
    const { result } = renderHook(
      () =>
        useAppMutation(["test"], {
          mutationFn: (vars: string) => Promise.resolve(`result: ${vars}`),
        }),
      { wrapper: createWrapper() },
    );

    result.current.mutate("data");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe("result: data");
  });

  it("shows toast on HttpException when defaultErrorHandling is true", async () => {
    const error = new HttpException({ status: 400 } as Response, {
      message: "Mutation failed",
    });

    const { result } = renderHook(
      () =>
        useAppMutation(["test"], {
          mutationFn: () => Promise.reject(error),
          defaultErrorHandling: true,
        }),
      { wrapper: createWrapper() },
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast).toHaveBeenCalledWith({
      title: "Mutation failed",
      variant: "destructive",
    });
  });

  it("does not show toast when defaultErrorHandling is false", async () => {
    const error = new HttpException({ status: 400 } as Response, {
      message: "Mutation failed",
    });

    const { result } = renderHook(
      () =>
        useAppMutation(["test"], {
          mutationFn: () => Promise.reject(error),
          defaultErrorHandling: false,
        }),
      { wrapper: createWrapper() },
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast).not.toHaveBeenCalled();
  });
});
