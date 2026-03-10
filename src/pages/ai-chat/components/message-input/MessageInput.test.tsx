import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSendMessage } from "@/hooks";

import { MessageInput } from "./MessageInput";

vi.mock("lucide-react", () => ({
  Send: () => <div data-testid="send-icon">Send Icon</div>,
}));

vi.mock("@/hooks", async () => {
  const { useForm } = await import("react-hook-form");
  const { zodResolver } = await import("@hookform/resolvers/zod");
  return {
    useSendMessage: vi.fn(),
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
      disabled,
      type,
    }: {
      children: React.ReactNode;
      disabled?: boolean;
      type?: "submit" | "button";
    }) => (
      <button disabled={disabled} type={type} data-testid="send-button">
        {children}
      </button>
    ),
    Textarea: React.forwardRef<
      HTMLTextAreaElement,
      React.TextareaHTMLAttributes<HTMLTextAreaElement>
    >(({ onKeyDown, ...props }, ref) => (
      <textarea
        ref={ref}
        data-testid="message-textarea"
        aria-label="Message input"
        onKeyDown={onKeyDown}
        {...props}
      />
    )),
    InputError: ({ error }: { error?: string }) =>
      error ? <div data-testid="input-error">{error}</div> : null,
  };
});

describe("MessageInput", () => {
  const mutate = vi.fn();
  const mockOnPendingMessageChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSendMessage).mockReturnValue({
      mutate,
      isPending: false,
    } as never);
  });

  const renderComponent = (pendingMessage: string | null = null) => {
    return render(
      <MessageInput
        pendingMessage={pendingMessage}
        onPendingMessageChange={mockOnPendingMessageChange}
      />,
    );
  };

  describe("Rendering", () => {
    it("should render textarea with correct placeholder", () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute(
        "placeholder",
        "Ask for recommendations... (e.g., 'Recommend me something similar to Inception')",
      );
    });

    it("should render send button", () => {
      renderComponent();

      expect(screen.getByTestId("send-button")).toBeInTheDocument();
      expect(screen.getByTestId("send-icon")).toBeInTheDocument();
    });

    it("should not render error message initially", () => {
      renderComponent();

      expect(screen.queryByTestId("input-error")).not.toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("should disable textarea when pendingMessage exists", () => {
      renderComponent("Pending...");

      expect(screen.getByTestId("message-textarea")).toBeDisabled();
    });

    it("should disable button when message is empty", () => {
      renderComponent();

      expect(screen.getByTestId("send-button")).toBeDisabled();
    });

    it("should disable button when pendingMessage exists", () => {
      renderComponent("Pending...");

      expect(screen.getByTestId("send-button")).toBeDisabled();
    });

    it("should enable button when message is valid", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Valid message");

      await waitFor(() => {
        expect(screen.getByTestId("send-button")).not.toBeDisabled();
      });
    });
  });

  describe("Form submission", () => {
    it("should send message on form submit", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      await waitFor(() => {
        expect(mockOnPendingMessageChange).toHaveBeenCalledWith("Test message");
        expect(mutate).toHaveBeenCalledWith(
          { message: "Test message" },
          expect.objectContaining({
            onSuccess: expect.any(Function),
            onSettled: expect.any(Function),
          }),
        );
      });
    });

    it("should trim message before sending", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "  Test message  ");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
          { message: "Test message" },
          expect.objectContaining({
            onSuccess: expect.any(Function),
            onSettled: expect.any(Function),
          }),
        );
      });
    });

    it("should not send empty message", async () => {
      renderComponent();

      const button = screen.getByTestId("send-button");
      await user.click(button);

      expect(mutate).not.toHaveBeenCalled();
    });

    it("should not send message when pendingMessage exists", async () => {
      renderComponent("Pending...");

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      expect(mutate).not.toHaveBeenCalled();
    });

    it("should reset form on successful send", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      await waitFor(() => {
        expect(mutate).toHaveBeenCalled();
      });

      const onSuccess = mutate.mock.calls[0][1].onSuccess;
      await act(async () => {
        onSuccess();
      });

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });

    it("should clear pending message on settled", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      await waitFor(() => {
        expect(mutate).toHaveBeenCalled();
      });

      const onSettled = mutate.mock.calls[0][1].onSettled;
      onSettled();

      expect(mockOnPendingMessageChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Keyboard interactions", () => {
    it("should submit on Enter key", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message{Enter}");

      await waitFor(() => {
        expect(mutate).toHaveBeenCalled();
      });
    });

    it("should not submit on Shift+Enter", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message{Shift>}{Enter}{/Shift}");

      expect(mutate).not.toHaveBeenCalled();
    });
  });

  describe("Integration scenarios", () => {
    it("should handle full message send workflow", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Hello AI");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      await waitFor(() => {
        expect(mockOnPendingMessageChange).toHaveBeenCalledWith("Hello AI");
        expect(mutate).toHaveBeenCalled();
      });

      const { onSuccess, onSettled } = mutate.mock.calls[0][1];

      await act(async () => {
        onSuccess();
      });

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });

      await act(async () => {
        onSettled();
      });

      expect(mockOnPendingMessageChange).toHaveBeenCalledWith(null);
    });

    it("should handle error scenario", async () => {
      renderComponent();

      const textarea = screen.getByTestId("message-textarea");
      await user.type(textarea, "Test message");

      const button = screen.getByTestId("send-button");
      await user.click(button);

      await waitFor(() => {
        expect(mutate).toHaveBeenCalled();
      });

      const { onSettled } = mutate.mock.calls[0][1];

      await act(async () => {
        onSettled();
      });

      expect(mockOnPendingMessageChange).toHaveBeenCalledWith(null);

      await waitFor(() => {
        expect(textarea).toHaveValue("Test message");
      });
    });
  });
});
