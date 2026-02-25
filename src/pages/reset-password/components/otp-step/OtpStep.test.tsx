import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey, StorageKey } from "@/const";
import { useResetPasswordVerify } from "@/hooks";

import { OtpStep } from "./OtpStep";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useResetPasswordVerify: vi.fn(),
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
      asChild,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
      asChild?: boolean;
    }) =>
      asChild ? (
        <>{children}</>
      ) : (
        <button onClick={onClick} type={type}>
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
  };
});

describe("OtpStep", () => {
  const onSuccess = vi.fn();
  const mutate = vi.fn();
  userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useResetPasswordVerify).mockReturnValue({ mutate } as never);
    localStorage.setItem(StorageKey.EMAIL, "test@test.com");
  });

  it("renders form with code input", () => {
    render(<OtpStep onSuccess={onSuccess} />);
    expect(screen.getByLabelText("Code")).toBeInTheDocument();
  });

  it("reads email from localStorage as default value", () => {
    render(<OtpStep onSuccess={onSuccess} />);
    expect(useResetPasswordVerify).toHaveBeenCalled();
  });

  it("shows validation error when code is empty", async () => {
    render(<OtpStep onSuccess={onSuccess} />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getByTestId("input-error")).toBeInTheDocument(),
    );
  });

  it("calls mutate with code and email on valid submit", async () => {
    render(<OtpStep onSuccess={onSuccess} />);

    const input = screen.getByLabelText("Code");
    fireEvent.change(input, { target: { value: "1234" } });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        { code: "1234", email: "test@test.com" },
        expect.objectContaining({ onSuccess }),
      ),
    );
  });

  it("only allows numeric input", async () => {
    render(<OtpStep onSuccess={onSuccess} />);
    const input = screen.getByLabelText("Code");
    fireEvent.change(input, { target: { value: "abc123" } });
    expect((input as HTMLInputElement).value).toBe("123");
  });

  it("limits code to 4 digits", async () => {
    render(<OtpStep onSuccess={onSuccess} />);
    const input = screen.getByLabelText("Code");
    fireEvent.change(input, { target: { value: "12345" } });
    expect((input as HTMLInputElement).value).toBe("1234");
  });

  it("calls onSuccess after successful mutation", async () => {
    vi.mocked(useResetPasswordVerify).mockReturnValue({
      mutate: (_data: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    } as never);

    render(<OtpStep onSuccess={onSuccess} />);
    const input = screen.getByLabelText("Code");
    fireEvent.change(input, { target: { value: "1234" } });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("has link back to login", () => {
    render(<OtpStep onSuccess={onSuccess} />);
    expect(screen.getByText("Back to login").closest("a")).toHaveAttribute(
      "href",
      RouterKey.LOGIN,
    );
  });
});
