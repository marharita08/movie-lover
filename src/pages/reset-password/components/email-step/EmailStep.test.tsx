import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey, StorageKey } from "@/const";
import { useResetPasswordEmail } from "@/hooks";

import { EmailStep } from "./EmailStep";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useResetPasswordEmail: vi.fn(),
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
        {label && <label htmlFor={props.name}>{label}</label>}
        <input id={props.name} ref={ref} {...props} />
      </div>
    )),
    InputError: ({ error }: { error?: string }) =>
      error ? <span data-testid="input-error">{error}</span> : null,
  };
});

describe("EmailStep", () => {
  const onSuccess = vi.fn();
  const mutate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useResetPasswordEmail).mockReturnValue({ mutate } as never);
  });

  it("renders form with email input", () => {
    render(<EmailStep onSuccess={onSuccess} />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows validation error when email is empty", async () => {
    render(<EmailStep onSuccess={onSuccess} />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getByTestId("input-error")).toBeInTheDocument(),
    );
  });

  it("calls mutate with email on valid submit", async () => {
    render(<EmailStep onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        { email: "test@test.com" },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      ),
    );
  });

  it("saves email to localStorage and calls onSuccess on success", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    vi.mocked(useResetPasswordEmail).mockReturnValue({
      mutate: (_data: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    } as never);

    render(<EmailStep onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(setItem).toHaveBeenCalledWith(StorageKey.EMAIL, "test@test.com");
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("has link back to login", () => {
    render(<EmailStep onSuccess={onSuccess} />);
    expect(screen.getByText("Back to login").closest("a")).toHaveAttribute(
      "href",
      RouterKey.LOGIN,
    );
  });
});
