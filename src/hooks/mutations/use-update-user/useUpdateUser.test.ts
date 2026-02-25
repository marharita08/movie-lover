import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, QueryKey } from "@/const";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";
import { useUpdateUser } from "./useUpdateUser";

const mockInvalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

vi.mock("../../use-app-mutation/useAppMutation", () => ({
  useAppMutation: vi.fn(),
}));

vi.mock("../../use-toast/useToast", () => ({
  toast: vi.fn(),
}));

describe("useUpdateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useUpdateUser());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.UPDATE_USER]),
      expect.any(Object),
    );
  });

  it("onSuccess invalidates current user query and shows toast", () => {
    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        undefined as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useUpdateUser());

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [QueryKey.CURRENT_USER],
    });
    expect(toast).toHaveBeenCalledWith({
      title: "Your profile data has been updated successfully",
      variant: "success",
    });
  });
});
