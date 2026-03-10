import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MessageAuthor } from "@/const";
import { useChatHistory } from "@/hooks";
import type { ChatMessageResponse } from "@/types";

import { MessageList } from "./MessageList";

Element.prototype.scrollIntoView = vi.fn();

vi.mock("lucide-react", () => ({
  Bot: () => <div data-testid="bot-icon">Bot</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: false,
  }),
}));

vi.mock("@/hooks", () => ({
  useChatHistory: vi.fn(),
}));

vi.mock("@/components", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
  LoadingBubbles: () => <div data-testid="loading-bubbles">Typing...</div>,
}));

vi.mock("@/utils", () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
  formatDateTime: (date: string) => `Formatted: ${date}`,
}));

vi.mock("../message-item/MessageItem", () => ({
  MessageItem: ({ message }: { message: ChatMessageResponse }) => (
    <div data-testid={`message-${message.id}`}>
      <p>{message.text}</p>
    </div>
  ),
}));

describe("MessageList", () => {
  const mockMessages: ChatMessageResponse[] = [
    {
      id: "1",
      text: "Hello",
      author: MessageAuthor.USER,
      mediaItems: null,
      createdAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      text: "Hi there!",
      author: MessageAuthor.ASSISTANT,
      mediaItems: null,
      createdAt: "2024-01-01T10:01:00Z",
    },
  ];

  const defaultChatHistoryReturn = {
    data: {
      pages: [
        {
          results: mockMessages,
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      ],
      pageParams: [undefined],
    },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChatHistory).mockReturnValue(
      defaultChatHistoryReturn as never,
    );
  });

  describe("Loading state", () => {
    it("should show loading spinner when data is loading", () => {
      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        isLoading: true,
        data: undefined,
      } as never);

      render(<MessageList />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("should show empty message when no messages exist", () => {
      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        data: {
          pages: [
            {
              results: [],
              total: 0,
              page: 1,
              limit: 20,
              totalPages: 0,
            },
          ],
          pageParams: [undefined],
        },
      } as never);

      render(<MessageList />);

      expect(screen.getByText("No messages yet")).toBeInTheDocument();
    });

    it("should not show empty message when pending message exists", () => {
      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        data: {
          pages: [
            {
              results: [],
              total: 0,
              page: 1,
              limit: 20,
              totalPages: 0,
            },
          ],
          pageParams: [undefined],
        },
      } as never);

      render(<MessageList pendingMessage="Typing..." />);

      expect(screen.queryByText("No messages yet")).not.toBeInTheDocument();
    });
  });

  describe("Messages rendering", () => {
    it("should render all messages", () => {
      render(<MessageList />);

      expect(screen.getByTestId("message-1")).toBeInTheDocument();
      expect(screen.getByTestId("message-2")).toBeInTheDocument();
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi there!")).toBeInTheDocument();
    });

    it("should render messages in correct order (reversed from API)", () => {
      render(<MessageList />);

      const messages = screen.getAllByText(/Hello|Hi there!/);
      expect(messages[0]).toHaveTextContent("Hi there!");
      expect(messages[1]).toHaveTextContent("Hello");
    });
  });

  describe("Pending message", () => {
    it("should render optimistic user message when pending", () => {
      render(<MessageList pendingMessage="User is typing..." />);

      expect(screen.getByText("User is typing...")).toBeInTheDocument();
      expect(screen.getByTestId("message-__optimistic__")).toBeInTheDocument();
    });

    it("should show loading bubbles when pending message exists", () => {
      render(<MessageList pendingMessage="Pending..." />);

      expect(screen.getByTestId("loading-bubbles")).toBeInTheDocument();
      const botIcons = screen.getAllByTestId("bot-icon");
      expect(botIcons.length).toBeGreaterThan(0);
    });

    it("should not show loading bubbles when no pending message", () => {
      render(<MessageList />);

      expect(screen.queryByTestId("loading-bubbles")).not.toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("should show loading indicator when fetching next page", () => {
      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        hasNextPage: true,
        isFetchingNextPage: true,
      } as never);

      render(<MessageList />);

      const loadingElements = screen.getAllByTestId("loading");
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    it("should not show pagination loader when no more pages", () => {
      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        hasNextPage: false,
      } as never);

      render(<MessageList />);

      const loadingElements = screen.queryAllByTestId("loading");
      expect(loadingElements.length).toBe(0);
    });
  });

  describe("Multiple pages", () => {
    it("should render messages from multiple pages", () => {
      const page1Messages: ChatMessageResponse[] = [
        {
          id: "1",
          text: "Message 1",
          author: MessageAuthor.USER,
          mediaItems: null,
          createdAt: "2024-01-01T10:00:00Z",
        },
      ];

      const page2Messages: ChatMessageResponse[] = [
        {
          id: "2",
          text: "Message 2",
          author: MessageAuthor.ASSISTANT,
          mediaItems: null,
          createdAt: "2024-01-01T10:01:00Z",
        },
      ];

      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        data: {
          pages: [
            {
              results: page1Messages,
              total: 2,
              page: 1,
              limit: 1,
              totalPages: 2,
            },
            {
              results: page2Messages,
              total: 2,
              page: 2,
              limit: 1,
              totalPages: 2,
            },
          ],
          pageParams: [undefined, 2],
        },
      } as never);

      render(<MessageList />);

      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should render messages with pending message and loading bubbles", () => {
      render(<MessageList pendingMessage="Thinking..." />);

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi there!")).toBeInTheDocument();
      expect(screen.getByText("Thinking...")).toBeInTheDocument();
      expect(screen.getByTestId("loading-bubbles")).toBeInTheDocument();
    });

    it("should handle transition from loading to messages", async () => {
      const { rerender } = render(<MessageList />);

      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        isLoading: true,
        data: undefined,
      } as never);

      rerender(<MessageList />);
      expect(screen.getByTestId("loading")).toBeInTheDocument();

      vi.mocked(useChatHistory).mockReturnValue({
        ...defaultChatHistoryReturn,
        isLoading: false,
      } as never);

      rerender(<MessageList />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
        expect(screen.getByText("Hello")).toBeInTheDocument();
      });
    });
  });
});
