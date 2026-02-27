import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserProfile } from "./UserProfile";

const mutateMock = vi.fn<(data: { name: string }) => void>();

const mockUser = {
  email: "test@example.com",
  name: "John Doe",
};

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");

  return {
    useCurrentUser: () => ({
      data: mockUser,
    }),

    useUpdateUser: () => ({
      mutate: mutateMock,
    }),

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

vi.mock("@/components", () => {
  return {
    Button: ({
      children,
      ...props
    }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
      <button {...props}>{children}</button>
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

    InputError: ({ error }: { error?: string }) =>
      error ? <div data-testid="input-error">{error}</div> : null,

    Sphere: () => <div data-testid="sphere" />,
  };
});

vi.mock("./components", () => ({
  DeleteAccountDialog: () => <div>DeleteAccountDialog</div>,
  ChangePasswordDialog: () => <div>ChangePasswordDialog</div>,
}));

describe("UserProfile", () => {
  beforeEach(() => {
    mutateMock.mockClear();
  });

  it("renders user email and name", () => {
    render(<UserProfile />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("submits updated name", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);

    const input = screen.getByDisplayValue("John Doe");
    await user.clear(input);
    await user.type(input, "Jane Smith");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mutateMock).toHaveBeenCalledWith({
      name: "Jane Smith",
    });
  });

  it("resets form to default values", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);

    const input = await screen.findByDisplayValue("John Doe");

    await user.clear(input);
    await user.type(input, "Another Name");

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(await screen.findByDisplayValue("John Doe")).toBeInTheDocument();
  });
});
