import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useClearChat } from "@/hooks";

import { ClearChatDialog } from "./ClearChatDialog";

vi.mock("@/hooks", () => ({
  useClearChat: vi.fn(),
}));

vi.mock("@/components", () => {
  return {
    Button: ({
      children,
      onClick,
      disabled,
      variant,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      variant?: string;
    }) => (
      <button onClick={onClick} disabled={disabled} data-variant={variant}>
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
            { open, onOpenChange },
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
        {React.cloneElement(children, {
          onClick: () => onOpenChange?.(true),
        })}
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
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-footer">{children}</div>
    ),
  };
});

describe("ClearChatDialog", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClearChat).mockReturnValue({
      mutate,
      isPending: false,
    } as never);
  });

  const openDialog = () => {
    fireEvent.click(
      screen.getByTestId("dialog-trigger").querySelector("button")!,
    );
  };

  it("renders trigger button", () => {
    render(<ClearChatDialog />);
    expect(screen.getByText("Clear Chat")).toBeInTheDocument();
  });

  it("shows warning message when dialog is opened", () => {
    render(<ClearChatDialog />);
    openDialog();
    expect(screen.getByText(/Clear chat history?/i)).toBeInTheDocument();
  });

  it("shows detailed warning about deletion", () => {
    render(<ClearChatDialog />);
    openDialog();
    expect(
      screen.getByText(
        /This action cannot be undone. All messages and recommendations will be permanently deleted./i,
      ),
    ).toBeInTheDocument();
  });

  it("calls clearChat on confirm", () => {
    render(<ClearChatDialog />);
    openDialog();
    const dialogContent = screen.getByTestId("dialog-content");
    const clearButton = within(dialogContent).getByRole("button", {
      name: /^Clear Chat$/i,
    });
    fireEvent.click(clearButton);
    expect(mutate).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it("closes dialog on successful clear", () => {
    vi.mocked(useClearChat).mockReturnValue({
      mutate: (_: undefined, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
      isPending: false,
    } as never);

    render(<ClearChatDialog />);
    openDialog();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    const dialogContent = screen.getByTestId("dialog-content");
    const clearButton = within(dialogContent).getByRole("button", {
      name: /^Clear Chat$/i,
    });
    fireEvent.click(clearButton);
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  it("closes dialog on Cancel click", () => {
    render(<ClearChatDialog />);
    openDialog();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  it("disables buttons when isPending is true", () => {
    vi.mocked(useClearChat).mockReturnValue({
      mutate,
      isPending: true,
    } as never);

    render(<ClearChatDialog />);
    openDialog();
    const dialogFooter = screen.getByTestId("dialog-footer");
    const buttons = within(dialogFooter).getAllByRole("button");
    buttons.forEach((button) => expect(button).toBeDisabled());
  });

  it("shows 'Clearing...' text when pending", () => {
    vi.mocked(useClearChat).mockReturnValue({
      mutate,
      isPending: true,
    } as never);

    render(<ClearChatDialog />);
    openDialog();
    expect(screen.getByText("Clearing...")).toBeInTheDocument();
  });

  it("shows 'Clear Chat' text when not pending", () => {
    render(<ClearChatDialog />);
    openDialog();
    const dialogContent = screen.getByTestId("dialog-content");
    expect(
      within(dialogContent).getByRole("button", { name: /^Clear Chat$/i }),
    ).toBeInTheDocument();
  });
});
