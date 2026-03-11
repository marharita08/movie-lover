import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MediaType, MessageAuthor } from "@/const";
import type { ChatMessageResponse } from "@/types";

import { MessageItem } from "./MessageItem";

vi.mock("lucide-react", () => ({
  Bot: () => <div data-testid="bot-icon">Bot</div>,
  User: () => <div data-testid="user-icon">User</div>,
  AlertTriangleIcon: () => <div data-testid="alert-icon">Alert</div>,
}));

vi.mock("@/components", () => ({
  MediaList: ({ medias }: { medias: unknown[] }) => (
    <div data-testid="media-list">Media: {medias.length}</div>
  ),
}));

vi.mock("@/utils", () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
  formatDateTime: (date: string) => `Formatted: ${date}`,
}));

describe("MessageItem", () => {
  const baseMessage: ChatMessageResponse = {
    id: "1",
    text: "Test message",
    author: MessageAuthor.USER,
    createdAt: "2024-01-01T12:00:00Z",
    mediaItems: null,
  };

  describe("User messages", () => {
    it("should render user message with user icon", () => {
      render(<MessageItem message={baseMessage} />);

      expect(screen.getByText("Test message")).toBeInTheDocument();
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("bot-icon")).not.toBeInTheDocument();
    });

    it("should display formatted timestamp", () => {
      render(<MessageItem message={baseMessage} />);

      expect(
        screen.getByText("Formatted: 2024-01-01T12:00:00Z"),
      ).toBeInTheDocument();
    });
  });

  describe("Assistant messages", () => {
    it("should render assistant message with bot icon", () => {
      const assistantMessage: ChatMessageResponse = {
        ...baseMessage,
        author: MessageAuthor.ASSISTANT,
      };

      render(<MessageItem message={assistantMessage} />);

      expect(screen.getByText("Test message")).toBeInTheDocument();
      expect(screen.getByTestId("bot-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("user-icon")).not.toBeInTheDocument();
    });
  });

  describe("Error messages", () => {
    it("should display error icon when message has error", () => {
      const errorMessage: ChatMessageResponse = {
        ...baseMessage,
        isError: true,
      };

      render(<MessageItem message={errorMessage} />);

      expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("should not display error icon when message has no error", () => {
      render(<MessageItem message={baseMessage} />);

      expect(screen.queryByTestId("alert-icon")).not.toBeInTheDocument();
    });
  });

  describe("Media items", () => {
    it("should render media list when mediaItems exist", () => {
      const messageWithMedia: ChatMessageResponse = {
        ...baseMessage,
        mediaItems: [
          {
            id: 1,
            posterPath: "/path/to/poster1.jpg",
            title: "Inception",
            type: MediaType.MOVIE,
            imdbId: "tt1375666",
          },
          {
            id: 2,
            posterPath: "/path/to/poster2.jpg",
            title: "Breaking Bad",
            type: MediaType.TV,
          },
        ],
      };

      render(<MessageItem message={messageWithMedia} />);

      expect(screen.getByTestId("media-list")).toBeInTheDocument();
      expect(screen.getByText("Media: 2")).toBeInTheDocument();
    });

    it("should not render media list when mediaItems is empty", () => {
      const messageWithEmptyMedia: ChatMessageResponse = {
        ...baseMessage,
        mediaItems: [],
      };

      render(<MessageItem message={messageWithEmptyMedia} />);

      expect(screen.queryByTestId("media-list")).not.toBeInTheDocument();
    });

    it("should not render media list when mediaItems is null", () => {
      render(<MessageItem message={baseMessage} />);

      expect(screen.queryByTestId("media-list")).not.toBeInTheDocument();
    });
  });

  describe("Combined scenarios", () => {
    it("should render assistant message with error and media", () => {
      const complexMessage: ChatMessageResponse = {
        ...baseMessage,
        author: MessageAuthor.ASSISTANT,
        isError: true,
        mediaItems: [
          {
            id: 1,
            posterPath: "/path/to/poster.jpg",
            title: "The Matrix",
            type: MediaType.MOVIE,
            imdbId: "tt0133093",
          },
        ],
      };

      render(<MessageItem message={complexMessage} />);

      expect(screen.getByTestId("bot-icon")).toBeInTheDocument();
      expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
      expect(screen.getByTestId("media-list")).toBeInTheDocument();
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });
});
