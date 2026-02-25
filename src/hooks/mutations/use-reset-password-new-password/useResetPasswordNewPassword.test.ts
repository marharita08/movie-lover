import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey, StorageKey } from "@/const";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";
import { useResetPasswordNewPassword } from "./useResetPasswordNewPassword";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../use-app-mutation/useAppMutation", () => ({
  useAppMutation: vi.fn(),
}));

vi.mock("../../use-toast/useToast", () => ({
  toast: vi.fn(),
}));

describe("useResetPasswordNewPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useResetPasswordNewPassword());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.RESET_PASSWORD_NEW_PASSWORD]),
      expect.any(Object),
    );
  });

  it("onSuccess shows toast, removes items from localStorage and navigates to login", () => {
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");

    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        undefined as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useResetPasswordNewPassword());

    expect(toast).toHaveBeenCalledWith({
      title: "Password reset successfully",
      variant: "success",
    });
    expect(removeItem).toHaveBeenCalledWith(StorageKey.RESET_PASSWORD_TOKEN);
    expect(removeItem).toHaveBeenCalledWith(StorageKey.EMAIL);
    expect(removeItem).toHaveBeenCalledWith(StorageKey.RESET_PASSWORD_STEP);
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.LOGIN);
  });
});
