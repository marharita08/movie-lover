import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OtpPurpose, RouterKey, StorageKey } from "@/const";
import { useOtpCountdown, useSendOtp, useVerifyEmail } from "@/hooks";

import { EmailVerification } from "./EmailVerification";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks", () => ({
  useOtpCountdown: vi.fn(),
  useSendOtp: vi.fn(),
  useVerifyEmail: vi.fn(),
}));

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useOtpCountdown: vi.fn(),
    useSendOtp: vi.fn(),
    useVerifyEmail: vi.fn(),
    useAppForm: ({
      schema,
      defaultValues,
    }: {
      schema: unknown;
      defaultValues: unknown;
    }) =>
      useForm({
        resolver: zodResolver(schema as never),
        defaultValues: defaultValues as never,
      }),
  };
});

vi.mock("@/components", async () => {
  const React = await import("react");
  return {
    Button: ({
      children,
      onClick,
      type,
      variant,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      type?: "button" | "submit";
      variant?: string;
    }) => (
      <button onClick={onClick} type={type} data-variant={variant}>
        {children}
      </button>
    ),
    Input: React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        error?: boolean;
      }
    >(({ label, error: _error, ...props }, ref) => (
      <div>
        <input aria-label={label} ref={ref} {...props} />
      </div>
    )),
    InputError: ({ error }: { error?: string }) =>
      error ? <span data-testid="input-error">{error}</span> : null,
    Sphere: () => null,
  };
});

describe("EmailVerification", () => {
  const verifyMutate = vi.fn();
  const sendOtpMutate = vi.fn();
  const reset = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVerifyEmail).mockReturnValue({
      mutate: verifyMutate,
    } as never);
    vi.mocked(useSendOtp).mockReturnValue({ mutate: sendOtpMutate } as never);
    vi.mocked(useOtpCountdown).mockReturnValue({
      secondsLeft: 60,
      isFinished: false,
      reset,
    });
    localStorage.setItem(StorageKey.EMAIL, "test@test.com");
  });

  it("redirects to login if email is not in localStorage", () => {
    localStorage.removeItem(StorageKey.EMAIL);
    render(<EmailVerification />);
    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.LOGIN);
  });

  it("does not redirect when email is present", () => {
    render(<EmailVerification />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows countdown when isFinished is false", () => {
    render(<EmailVerification />);
    expect(
      screen.getByText(/Resend available in 60 seconds/),
    ).toBeInTheDocument();
  });

  it("shows Resend button when isFinished is true", () => {
    vi.mocked(useOtpCountdown).mockReturnValue({
      secondsLeft: 0,
      isFinished: true,
      reset,
    });
    render(<EmailVerification />);
    expect(screen.getByText("Resend")).toBeInTheDocument();
  });

  it("calls sendOtpMutation on Resend click", async () => {
    vi.mocked(useOtpCountdown).mockReturnValue({
      secondsLeft: 0,
      isFinished: true,
      reset,
    });
    render(<EmailVerification />);
    await user.click(screen.getByText("Resend"));
    expect(sendOtpMutate).toHaveBeenCalledWith(
      { email: "test@test.com", purpose: OtpPurpose.EMAIL_VERIFICATION },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("calls reset on successful resend", async () => {
    vi.mocked(useOtpCountdown).mockReturnValue({
      secondsLeft: 0,
      isFinished: true,
      reset,
    });
    vi.mocked(useSendOtp).mockReturnValue({
      mutate: (_data: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    } as never);

    render(<EmailVerification />);
    await user.click(screen.getByText("Resend"));
    expect(reset).toHaveBeenCalled();
  });

  it("calls verifyEmailMutation on form submit", async () => {
    render(<EmailVerification />);

    const input = screen.getByLabelText("Code");
    fireEvent.change(input, { target: { value: "1234" } });

    fireEvent.submit(
      screen.getByRole("form", { name: "email-verification-form" }),
    );

    await waitFor(() =>
      expect(verifyMutate).toHaveBeenCalledWith(
        expect.objectContaining({ code: "1234", email: "test@test.com" }),
      ),
    );
  });
});
