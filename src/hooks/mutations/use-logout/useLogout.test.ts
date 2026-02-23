import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey } from "@/const";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { useLogout } from "./useLogout";

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

describe("useLogout", () => {
  const removeAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAccessTokenStore).mockReturnValue({ removeAccessToken });
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useLogout());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.LOGOUT]),
      expect.any(Object),
    );
  });

  it("onSuccess calls removeAccessToken and navigates to login", () => {
    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        undefined as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useLogout());

    expect(removeAccessToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.LOGIN);
  });
});
