import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey, TranslationKey } from "@/const";
import { en } from "@/const/translations/en";
import { useLogin } from "@/hooks";

import { Login } from "./Login";

vi.mock("react-router-dom", () => {
  const React = require("react");
  return {
    Link: ({ children, to, ...rest }: any) =>
      React.isValidElement(children)
        ? React.cloneElement(children as any, { href: to, ...rest })
        : React.createElement("a", { href: to, ...rest }, children),
    useNavigate: () => vi.fn(),
  };
});

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
    useTranslation: () => ({
      t: (key: TranslationKey) => en[key] || key,
    }),
    useLanguageStore: () => ({
      language: "en-US",
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
    LoginWithGoogleButton: ({ className }: { className?: string }) => (
      <button type="button" className={className}>
        Login with Google
      </button>
    ),
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
    expect(screen.getByTestId("login-signup-link")).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("has link to forgot password page", () => {
    render(<Login />);
    expect(screen.getByTestId("login-forgot-link")).toHaveAttribute(
      "href",
      RouterKey.RESET_PASSWORD,
    );
  });

  it("renders login with google button", () => {
    render(<Login />);
    expect(
      screen.getByRole("button", { name: "Login with Google" }),
    ).toBeInTheDocument();
  });
});
