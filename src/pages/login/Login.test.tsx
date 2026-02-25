import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey } from "@/const";
import { useLogin } from "@/hooks";

import { Login } from "./Login";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useLogin: vi.fn(),
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
      type?: "submit" | "button";
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
        startIcon?: React.ReactNode;
      }
    >(({ label, error: _error, startIcon: _startIcon, ...props }, ref) => (
      <div>
        {label && <label htmlFor={props.name}>{label}</label>}
        <input id={props.name} ref={ref} {...props} />
      </div>
    )),
    PasswordInput: React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
    >(({ error: _error, ...props }, ref) => (
      <input aria-label="password" type="password" ref={ref} {...props} />
    )),
    InputError: ({ error }: { error?: string }) =>
      error ? <span data-testid="input-error">{error}</span> : null,
    Sphere: () => null,
  };
});

describe("Login", () => {
  const mutate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogin).mockReturnValue({ mutate } as never);
  });

  it("renders login form", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<Login />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getAllByTestId("input-error").length).toBeGreaterThan(0),
    );
  });

  it("calls mutate with form data on valid submit", async () => {
    render(<Login />);
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("password"), "password123");
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@test.com",
          password: "password123",
        }),
      ),
    );
  });

  it("has link to signup page", () => {
    render(<Login />);
    expect(screen.getByText("Sign up").closest("a")).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("has link to forgot password page", () => {
    render(<Login />);
    expect(screen.getByText("Forgot password?").closest("a")).toHaveAttribute(
      "href",
      RouterKey.RESET_PASSWORD,
    );
  });
});
