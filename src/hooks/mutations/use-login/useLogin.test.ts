import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey } from "@/const";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { useLogin } from "./useLogin";

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

describe("useLogin", () => {
  const setAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAccessTokenStore).mockReturnValue({ setAccessToken });
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useLogin());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.LOGIN]),
      expect.any(Object),
    );
  });

  it("onSuccess calls setAccessToken and navigates to dashboard", () => {
    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        { accessToken: "new-token" } as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useLogin());

    expect(setAccessToken).toHaveBeenCalledWith("new-token");
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.DASHBOARD);
  });
});
