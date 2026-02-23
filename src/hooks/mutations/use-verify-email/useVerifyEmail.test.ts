import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey, StorageKey } from "@/const";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { useVerifyEmail } from "./useVerifyEmail";

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

describe("useVerifyEmail", () => {
  const setAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAccessTokenStore).mockReturnValue({ setAccessToken });
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useVerifyEmail());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.VERIFY_EMAIL]),
      expect.any(Object),
    );
  });

  it("onSuccess calls setAccessToken, removes email from localStorage and navigates to dashboard", () => {
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");

    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        { accessToken: "new-token" } as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useVerifyEmail());

    expect(setAccessToken).toHaveBeenCalledWith("new-token");
    expect(removeItem).toHaveBeenCalledWith(StorageKey.EMAIL);
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.DASHBOARD);
  });
});
