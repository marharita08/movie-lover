import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StorageKey } from "@/const";

import { ResetPasswordStep } from "./const";
import { ResetPassword } from "./ResetPassword";

vi.mock("@/components", () => ({
  Sphere: () => null,
}));

vi.mock("./components", () => ({
  EmailStep: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="email-step">
      <button onClick={onSuccess}>Next from Email</button>
    </div>
  ),
  OtpStep: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="otp-step">
      <button onClick={onSuccess}>Next from OTP</button>
    </div>
  ),
  NewPasswordStep: () => <div data-testid="new-password-step" />,
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem(StorageKey.RESET_PASSWORD_STEP);
  });

  it("shows EmailStep by default", () => {
    render(<ResetPassword />);
    expect(screen.getByTestId("email-step")).toBeInTheDocument();
  });

  it("reads initial step from localStorage", () => {
    localStorage.setItem(StorageKey.RESET_PASSWORD_STEP, ResetPasswordStep.OTP);
    render(<ResetPassword />);
    expect(screen.getByTestId("otp-step")).toBeInTheDocument();
  });

  it("saves step to localStorage when step changes", async () => {
    render(<ResetPassword />);
    fireEvent.click(screen.getByText("Next from Email"));
    await waitFor(() =>
      expect(localStorage.getItem(StorageKey.RESET_PASSWORD_STEP)).toBe(
        ResetPasswordStep.OTP,
      ),
    );
  });

  it("moves to OtpStep after EmailStep onSuccess", () => {
    render(<ResetPassword />);
    fireEvent.click(screen.getByText("Next from Email"));
    expect(screen.getByTestId("otp-step")).toBeInTheDocument();
  });

  it("moves to NewPasswordStep after OtpStep onSuccess", () => {
    localStorage.setItem(StorageKey.RESET_PASSWORD_STEP, ResetPasswordStep.OTP);
    render(<ResetPassword />);
    fireEvent.click(screen.getByText("Next from OTP"));
    expect(screen.getByTestId("new-password-step")).toBeInTheDocument();
  });

  it("shows NewPasswordStep when step is NEW_PASSWORD", () => {
    localStorage.setItem(
      StorageKey.RESET_PASSWORD_STEP,
      ResetPasswordStep.NEW_PASSWORD,
    );
    render(<ResetPassword />);
    expect(screen.getByTestId("new-password-step")).toBeInTheDocument();
  });
});
