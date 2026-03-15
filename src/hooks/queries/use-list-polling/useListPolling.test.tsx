import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ListStatus, QueryKey, RouterKey } from "@/const";
import { listService } from "@/services";

import { useListPolling } from "./useListPolling";

const mockNavigate = vi.fn();
const mockRefetchQueries = vi.fn();
const mockToast = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  generatePath: (path: string, params: Record<string, string>) =>
    path.replace(":id", params.id),
}));

vi.mock("@/hooks/use-toast/useToast", () => ({
  toast: (args: unknown) => mockToast(args),
}));

vi.mock("@/services", () => ({
  listService: {
    getById: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  queryClient.refetchQueries = mockRefetchQueries;

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useListPolling", () => {
  const setProcessingListId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not fetch when listId is null", () => {
    renderHook(() => useListPolling(null, setProcessingListId), {
      wrapper: createWrapper(),
    });

    expect(listService.getById).not.toHaveBeenCalled();
  });

  it("fetches list when listId is provided", async () => {
    vi.mocked(listService.getById).mockResolvedValue({
      id: "list-uuid",
      status: ListStatus.PROCESSING,
    } as never);

    renderHook(() => useListPolling("list-uuid", setProcessingListId), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(listService.getById).toHaveBeenCalledWith("list-uuid"),
    );
  });

  it("returns isProcessing true when status is PROCESSING", async () => {
    vi.mocked(listService.getById).mockResolvedValue({
      id: "list-uuid",
      status: ListStatus.PROCESSING,
    } as never);

    const { result } = renderHook(
      () => useListPolling("list-uuid", setProcessingListId),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isProcessing).toBe(true));
  });

  it("navigates to list page and resets state when status is COMPLETED", async () => {
    vi.mocked(listService.getById).mockResolvedValue({
      id: "list-uuid",
      status: ListStatus.COMPLETED,
    } as never);

    renderHook(() => useListPolling("list-uuid", setProcessingListId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(setProcessingListId).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith(
        RouterKey.LIST.replace(":id", "list-uuid"),
      );
      expect(mockRefetchQueries).toHaveBeenCalledWith({
        queryKey: [QueryKey.LISTS],
      });
    });
  });

  it("shows toast, navigates to lists and resets state when status is FAILED", async () => {
    vi.mocked(listService.getById).mockResolvedValue({
      id: "list-uuid",
      status: ListStatus.FAILED,
      errorMessage: "Processing failed",
    } as never);

    renderHook(() => useListPolling("list-uuid", setProcessingListId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(setProcessingListId).toHaveBeenCalledWith(null);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Processing failed",
        variant: "destructive",
      });
      expect(mockNavigate).toHaveBeenCalledWith(RouterKey.LISTS);
      expect(mockRefetchQueries).toHaveBeenCalledWith({
        queryKey: [QueryKey.LISTS],
      });
    });
  });

  it("returns isProcessing false when status is COMPLETED", async () => {
    vi.mocked(listService.getById).mockResolvedValue({
      id: "list-uuid",
      status: ListStatus.COMPLETED,
    } as never);

    const { result } = renderHook(
      () => useListPolling("list-uuid", setProcessingListId),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isProcessing).toBe(false));
  });
});
