import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey, StorageKey } from "@/const";
import { useResetPasswordNewPassword } from "@/hooks";

import { NewPasswordStep } from "./NewPasswordStep";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useResetPasswordNewPassword: vi.fn(),
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
      type?: "submit" | "button" | "reset";
      asChild?: boolean;
    }) =>
      asChild ? (
        <>{children}</>
      ) : (
        <button onClick={onClick} type={type}>
          {children}
        </button>
      ),
    PasswordInput: React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        error?: boolean;
      }
    >(({ label, error: _error, ...props }, ref) => (
      <input
        aria-label={label ?? "password"}
        type="password"
        ref={ref}
        {...props}
      />
    )),
    InputError: ({ error }: { error?: string }) =>
      error ? <span data-testid="input-error">{error}</span> : null,
  };
});

describe("NewPasswordStep", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useResetPasswordNewPassword).mockReturnValue({ mutate } as never);
    localStorage.setItem(StorageKey.EMAIL, "test@test.com");
    localStorage.setItem(StorageKey.RESET_PASSWORD_TOKEN, "reset-token");
  });

  it("renders password inputs", () => {
    render(<NewPasswordStep />);
    expect(screen.getByLabelText("password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<NewPasswordStep />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getAllByTestId("input-error").length).toBeGreaterThan(0),
    );
  });

  it("calls mutate without confirmPassword on valid submit", async () => {
    render(<NewPasswordStep />);
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          password: "Password123!",
          email: "test@test.com",
          token: "reset-token",
        }),
      ),
    );
  });

  it("does not include confirmPassword in mutate call", async () => {
    render(<NewPasswordStep />);
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      const calledWith = mutate.mock.calls[0][0];
      expect(calledWith).not.toHaveProperty("confirmPassword");
    });
  });

  it("reads email and token from localStorage", () => {
    render(<NewPasswordStep />);
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form"));

    waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@test.com",
          token: "reset-token",
        }),
      ),
    );
  });

  it("has link back to login", () => {
    render(<NewPasswordStep />);
    expect(screen.getByText("Back to login").closest("a")).toHaveAttribute(
      "href",
      RouterKey.LOGIN,
    );
  });
});
