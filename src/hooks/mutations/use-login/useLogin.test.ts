import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey } from "@/const";
import { useAccessTokenStore } from "@/store/access-token.store";
import { useLanguageStore } from "@/store/language.store";

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

vi.mock("@/store/language.store", () => ({
  useLanguageStore: vi.fn(),
}));

describe("useLogin", () => {
  const setAccessToken = vi.fn();
  const setLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAccessTokenStore).mockReturnValue({ setAccessToken });
    vi.mocked(useLanguageStore).mockReturnValue({ setLanguage });
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useLogin());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.LOGIN]),
      expect.any(Object),
    );
  });

  it("onSuccess calls setAccessToken, setLanguage and navigates to dashboard", () => {
    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        { accessToken: "new-token", language: "en" } as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useLogin());

    expect(setAccessToken).toHaveBeenCalledWith("new-token");
    expect(setLanguage).toHaveBeenCalledWith("en");
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.DASHBOARD);
  });
});
