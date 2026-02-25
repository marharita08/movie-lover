import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OtpPurpose, RouterKey, StorageKey } from "@/const";
import { useCurrentUser, useSendOtp } from "@/hooks";

import { AuthGuard } from "./AuthGuard";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to} />
  ),
}));

vi.mock("@/hooks", () => ({
  useCurrentUser: vi.fn(),
  useSendOtp: vi.fn(),
}));

vi.mock("@/components", () => ({
  LoadingOverlay: () => <div data-testid="loading-overlay" />,
}));

const verifiedUser = { email: "test@test.com", isEmailVerified: true };
const unverifiedUser = { email: "test@test.com", isEmailVerified: false };

describe("AuthGuard", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSendOtp).mockReturnValue({ mutate } as never);
  });

  it("shows LoadingOverlay when isLoading is true", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as never);
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    const navigate = screen.getByTestId("navigate");
    expect(navigate).toHaveAttribute("data-to", RouterKey.LOGIN);
  });

  it("renders children when user is authenticated and email is verified", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: verifiedUser,
      isLoading: false,
    } as never);
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );
    expect(screen.getByText("Protected")).toBeInTheDocument();
  });

  it("calls sendOtpMutation when user email is not verified", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: unverifiedUser,
      isLoading: false,
    } as never);
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        { email: unverifiedUser.email, purpose: OtpPurpose.EMAIL_VERIFICATION },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      ),
    );
  });

  it("saves email to localStorage and navigates to email verification on success", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    vi.mocked(useCurrentUser).mockReturnValue({
      data: unverifiedUser,
      isLoading: false,
    } as never);

    vi.mocked(useSendOtp).mockReturnValue({
      mutate: (_data: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    } as never);

    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(setItem).toHaveBeenCalledWith(
        StorageKey.EMAIL,
        unverifiedUser.email,
      );
      expect(mockNavigate).toHaveBeenCalledWith(RouterKey.EMAIL_VERIFICATION);
    });
  });

  it("navigates to login on sendOtp error", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: unverifiedUser,
      isLoading: false,
    } as never);

    vi.mocked(useSendOtp).mockReturnValue({
      mutate: (_data: unknown, options: { onError: () => void }) => {
        options.onError();
      },
    } as never);

    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(RouterKey.LOGIN);
    });
  });
});
