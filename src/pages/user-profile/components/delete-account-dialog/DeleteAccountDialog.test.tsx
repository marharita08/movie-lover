import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteAccount } from "@/hooks";

import { DeleteAccountDialog } from "./DeleteAccountDialog";

vi.mock("@/hooks", () => ({
  useDeleteAccount: vi.fn(),
}));

vi.mock("@/components", async () => {
  const React = await import("react");
  return {
    Button: ({
      children,
      onClick,
      type,
      disabled,
      variant,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
      variant?: string;
    }) => (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        data-variant={variant}
      >
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
  };
});

const openDialog = () => {
  fireEvent.click(
    screen.getByTestId("dialog-trigger").querySelector("button")!,
  );
};

const getConfirmButton = () =>
  screen
    .getAllByRole("button", { name: /Delete Account/i })
    .find((btn) => btn.getAttribute("data-variant") === "destructive")!;

describe("DeleteAccountDialog", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteAccount).mockReturnValue({
      mutate,
      isPending: false,
    } as never);
  });

  it("shows trigger button", () => {
    render(<DeleteAccountDialog />);
    expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
  });

  it("opens dialog on trigger click", () => {
    render(<DeleteAccountDialog />);
    openDialog();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
  });

  it("shows confirmation text", () => {
    render(<DeleteAccountDialog />);
    openDialog();
    expect(
      screen.getByText(/Are you sure you want to delete your account/),
    ).toBeInTheDocument();
  });

  it("closes dialog on Cancel click", () => {
    render(<DeleteAccountDialog />);
    openDialog();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  it("calls deleteAccount on confirm click", () => {
    render(<DeleteAccountDialog />);
    openDialog();
    fireEvent.click(getConfirmButton());
    expect(mutate).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("closes dialog on successful delete", async () => {
    vi.mocked(useDeleteAccount).mockReturnValue({
      mutate: (_data: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
      isPending: false,
    } as never);

    render(<DeleteAccountDialog />);
    openDialog();
    fireEvent.click(getConfirmButton());

    await waitFor(() =>
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument(),
    );
  });

  it("disables confirm button when isDeleting is true", () => {
    vi.mocked(useDeleteAccount).mockReturnValue({
      mutate,
      isPending: true,
    } as never);
    render(<DeleteAccountDialog />);
    openDialog();
    expect(getConfirmButton()).toBeDisabled();
  });
});
