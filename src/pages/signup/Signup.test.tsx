import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StorageKey, TranslationKey } from "@/const";
import { en } from "@/const/translations/en";
import { useSignUp } from "@/hooks";

import { Signup } from "./Signup";

vi.mock("react-router-dom", () => {
  return {
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...rest }: any) =>
      React.isValidElement(children)
        ? React.cloneElement(children as any, { href: to, ...rest })
        : React.createElement("a", { href: to, ...rest }, children),
  };
});

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useSignUp: vi.fn(),
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
    LoginWithGoogleButton: ({
      className,
      label,
    }: {
      className?: string;
      label?: string;
    }) => (
      <button type="button" className={className}>
        {label}
      </button>
    ),
  };
});

describe("Signup", () => {
  const mutate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSignUp).mockReturnValue({ mutate } as never);
  });

  it("renders signup form", () => {
    render(<Signup />);
    expect(
      screen.getByRole("heading", { name: "Sign up" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<Signup />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getAllByTestId("input-error").length).toBeGreaterThan(0),
    );
  });

  it("calls mutate with form data on valid submit", async () => {
    render(<Signup />);
    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("password"), "Password123!");
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "test@test.com",
          password: "Password123!",
        }),
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      ),
    );
  });

  it("saves email to localStorage on success", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    vi.mocked(useSignUp).mockReturnValue({
      mutate: (
        _data: { email: string },
        options: { onSuccess: () => void },
      ) => {
        options.onSuccess();
      },
    } as never);

    render(<Signup />);
    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("password"), "Password123!");
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(setItem).toHaveBeenCalledWith(StorageKey.EMAIL, "test@test.com"),
    );
  });

  it("has link to login page", () => {
    render(<Signup />);
    expect(screen.getByTestId("signup-login-link")).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("renders signup with google button", () => {
    render(<Signup />);
    expect(
      screen.getByRole("button", { name: "Sign up with Google" }),
    ).toBeInTheDocument();
  });
});
