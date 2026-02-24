import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteList } from "@/hooks";

import { DeleteListDialog } from "./DeleteListDialog";

vi.mock("@/hooks", () => ({
  useDeleteList: vi.fn(),
}));

vi.mock("@/components", () => {
  return {
    Button: ({
      children,
      onClick,
      disabled,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }) => (
      <button onClick={onClick} disabled={disabled}>
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
  };
});

describe("DeleteListDialog", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteList).mockReturnValue({
      mutate,
      isPending: false,
    } as never);
  });

  const openDialog = () => {
    fireEvent.click(
      screen.getByTestId("dialog-trigger").querySelector("button")!,
    );
  };

  it("shows list name in confirmation text", () => {
    render(<DeleteListDialog listId="123" listName="My Favorite Movies" />);
    openDialog();
    expect(screen.getByText(/My Favorite Movies/)).toBeInTheDocument();
  });

  it("calls deleteList with correct listId on confirm", () => {
    render(<DeleteListDialog listId="123" listName="My List" />);
    openDialog();
    fireEvent.click(screen.getByRole("button", { name: /Delete List/i }));
    expect(mutate).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it("closes dialog on successful delete", () => {
    vi.mocked(useDeleteList).mockReturnValue({
      mutate: (_id: string, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
      isPending: false,
    } as never);

    render(<DeleteListDialog listId="123" listName="My List" />);
    openDialog();
    fireEvent.click(screen.getByRole("button", { name: /Delete List/i }));
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  it("closes dialog on Cancel click", () => {
    render(<DeleteListDialog listId="123" listName="My List" />);
    openDialog();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  it("disables buttons when isDeleting is true", () => {
    vi.mocked(useDeleteList).mockReturnValue({
      mutate,
      isPending: true,
    } as never);
    render(<DeleteListDialog listId="123" listName="My List" />);
    openDialog();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => expect(button).toBeDisabled());
  });
});
