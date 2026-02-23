import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MutationKey, RouterKey } from "@/const";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";
import { useSignUp } from "./useSignUp";

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

describe("useSignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppMutation).mockReturnValue({} as never);
  });

  it("calls useAppMutation with correct mutation key", () => {
    renderHook(() => useSignUp());
    expect(useAppMutation).toHaveBeenCalledWith(
      expect.arrayContaining([MutationKey.SIGNUP]),
      expect.any(Object),
    );
  });

  it("onSuccess navigates to email verification and shows toast with message", () => {
    vi.mocked(useAppMutation).mockImplementation((_key, options) => {
      options.onSuccess?.(
        { message: "Check your email" } as never,
        undefined as never,
        undefined as never,
        {} as never,
      );
      return {} as never;
    });

    renderHook(() => useSignUp());

    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.EMAIL_VERIFICATION);
    expect(toast).toHaveBeenCalledWith({
      title: "Check your email",
      variant: "success",
    });
  });
});
