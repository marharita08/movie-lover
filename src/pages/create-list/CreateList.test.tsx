import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCreateList } from "@/hooks";

import { CreateList } from "./CreateList";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/components", async () => {
  const React = await import("react");
  return {
    Button: ({
      children,
      onClick,
      type,
      disabled,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
    }) => (
      <button onClick={onClick} type={type} disabled={disabled}>
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
    InputError: ({ error }: { error?: string }) =>
      error ? <span data-testid="input-error">{error}</span> : null,
    Label: ({ children }: { children: React.ReactNode }) => (
      <label>{children}</label>
    ),
    FileUploader: ({
      setFileId,
    }: {
      setFileId: (id: string | null) => void;
    }) => {
      React.useEffect(() => {
        setFileId("12345678-1234-1234-1234-123456789012");
      }, [setFileId]);
      return <div data-testid="file-uploader" />;
    },
    CreateListLoading: () => <div data-testid="create-list-loading" />,
    Sphere: () => null,
  };
});

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
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
    useCreateList: vi.fn(),
  };
});

describe("CreateList", () => {
  const mutate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateList).mockReturnValue({
      mutate,
      isPending: false,
    } as never);
  });

  it("shows CreateListLoading when isPending is true", () => {
    vi.mocked(useCreateList).mockReturnValue({
      mutate,
      isPending: true,
    } as never);
    render(<CreateList />);
    expect(screen.getByTestId("create-list-loading")).toBeInTheDocument();
  });

  it("renders form when not pending", () => {
    render(<CreateList />);
    expect(screen.getByText("Create List")).toBeInTheDocument();
  });

  it("navigates back on Back button click", async () => {
    render(<CreateList />);
    await user.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("shows validation error when name is empty", async () => {
    render(<CreateList />);
    await user.click(screen.getByText("Create"));
    await waitFor(() =>
      expect(screen.getByTestId("input-error")).toBeInTheDocument(),
    );
  });

  it("calls mutate with form data on valid submit", async () => {
    render(<CreateList />);

    await user.type(screen.getByLabelText("Name"), "My List");

    fireEvent.submit(screen.getByRole("form", { name: "create-list-form" }));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "My List",
          fileId: "12345678-1234-1234-1234-123456789012",
        }),
      ),
    );
  });
});
