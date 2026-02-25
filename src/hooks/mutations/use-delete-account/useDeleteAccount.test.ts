import type { MutationFunctionContext } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey } from "@/const";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";
import { useDeleteAccount } from "./useDeleteAccount";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../use-app-mutation/useAppMutation", () => ({
  useAppMutation: vi.fn(),
}));

vi.mock("@/store/access-token.store", () => ({
  useAccessTokenStore: vi.fn(),
}));

vi.mock("../../use-toast/useToast", () => ({
  toast: vi.fn(),
}));

describe("useDeleteAccount", () => {
  const removeAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAccessTokenStore).mockReturnValue({ removeAccessToken });
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useDeleteAccount());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.DELETE_ACCOUNT]),
      expect.any(Object),
    );
  });

  it("onSuccess calls removeAccessToken, navigate and toast", () => {
    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        undefined,
        undefined,
        undefined,
        {} as MutationFunctionContext,
      );
      return {} as never;
    });

    renderHook(() => useDeleteAccount());

    expect(removeAccessToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.LOGIN);
    expect(toast).toHaveBeenCalledWith({
      title: "Account deleted successfully",
      variant: "success",
    });
  });
});
