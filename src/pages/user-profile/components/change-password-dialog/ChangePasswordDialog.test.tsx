import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useChangePassword } from "@/hooks";

import { ChangePasswordDialog } from "./ChangePasswordDialog";

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useChangePassword: vi.fn(),
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
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
    }) => (
      <button onClick={onClick} type={type}>
        {children}
      </button>
    ),
    Dialog: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean;
      onOpenChange: (v: boolean) => void;
      children: React.ReactNode;
    }) => (
      <div data-testid="dialog">
        {React.Children.map(children, (child) =>
          React.cloneElement(
            child as React.ReactElement<{
              open: boolean;
              onOpenChange: (v: boolean) => void;
            }>,
            {
              open,
              onOpenChange,
            },
          ),
        )}
      </div>
    ),
    DialogTrigger: ({
      children,
      onOpenChange,
    }: {
      children: React.ReactElement<{ onClick?: () => void }>;
      onOpenChange?: (v: boolean) => void;
    }) => (
      <div data-testid="dialog-trigger">
        {React.cloneElement(children, { onClick: () => onOpenChange?.(true) })}
      </div>
    ),
    DialogContent: ({
      children,
      open,
    }: {
      children: React.ReactNode;
      open?: boolean;
    }) => (open ? <div data-testid="dialog-content">{children}</div> : null),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
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

const openDialog = () => {
  fireEvent.click(
    screen.getByTestId("dialog-trigger").querySelector("button")!,
  );
};

describe("ChangePasswordDialog", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChangePassword).mockReturnValue({ mutate } as never);
  });

  it("shows trigger button", () => {
    render(<ChangePasswordDialog />);
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  it("opens dialog on trigger click", () => {
    render(<ChangePasswordDialog />);
    openDialog();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
  });

  it("closes dialog on Cancel click", () => {
    render(<ChangePasswordDialog />);
    openDialog();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<ChangePasswordDialog />);
    openDialog();
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getAllByTestId("input-error").length).toBeGreaterThan(0),
    );
  });

  it("calls mutate without confirmPassword on valid submit", async () => {
    render(<ChangePasswordDialog />);
    openDialog();

    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({ password: "Password123!" }),
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
      const calledWith = mutate.mock.calls[0][0];
      expect(calledWith).not.toHaveProperty("confirmPassword");
    });
  });

  it("closes dialog on successful submit", async () => {
    vi.mocked(useChangePassword).mockReturnValue({
      mutate: (_data: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    } as never);

    render(<ChangePasswordDialog />);
    openDialog();

    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument(),
    );
  });

  it("resets form when dialog closes", async () => {
    render(<ChangePasswordDialog />);
    openDialog();

    const passwordInput = screen.getByLabelText("password") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    expect(passwordInput.value).toBe("Password123!");

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();

    openDialog();
    expect((screen.getByLabelText("password") as HTMLInputElement).value).toBe(
      "",
    );
  });
});
