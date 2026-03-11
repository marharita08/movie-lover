import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { MessageAuthor } from "@/const";
import type { ChatMessageValidationSchema } from "@/pages/ai-chat";
import type {
  ChatHistoryQuery,
  ChatMessageResponse,
  PaginatedResponse,
} from "@/types";

import { httpService } from "../http/http.service";
import { ChatService } from "./chat.service";

vi.mock("../http/http.service", () => ({
  httpService: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ChatService", () => {
  let chatService: ChatService;

  beforeEach(() => {
    vi.clearAllMocks();
    chatService = new ChatService();
  });

  describe("sendMessage", () => {
    it("should send message and return response", async () => {
      const messageData: ChatMessageValidationSchema = {
        message: "Hello, how are you?",
      };
      const mockResponse: ChatMessageResponse = {
        id: "msg-456",
        text: "Hello! I'm doing well, thank you!",
        author: MessageAuthor.ASSISTANT,
        mediaItems: null,
        createdAt: new Date().toISOString(),
      };
      (httpService.post as Mock).mockResolvedValue(mockResponse);

      const result = await chatService.sendMessage(messageData);

      expect(httpService.post).toHaveBeenCalledTimes(1);
      expect(httpService.post).toHaveBeenCalledWith(
        "/chat/message",
        messageData,
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when request fails", async () => {
      const messageData: ChatMessageValidationSchema = {
        message: "Test message",
      };

      const mockError = new Error("Network error");
      (httpService.post as Mock).mockRejectedValue(mockError);

      await expect(chatService.sendMessage(messageData)).rejects.toThrow(
        "Network error",
      );
      expect(httpService.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("getHistory", () => {
    it("should fetch chat history with query parameters", async () => {
      const query: ChatHistoryQuery = {
        page: 1,
        limit: 20,
      };

      const mockResponse: PaginatedResponse<ChatMessageResponse> = {
        results: [
          {
            id: "msg-1",
            text: "First message",
            author: MessageAuthor.USER,
            mediaItems: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "msg-2",
            text: "Second message",
            author: MessageAuthor.ASSISTANT,
            mediaItems: null,
            createdAt: new Date().toISOString(),
          },
        ],
        totalResults: 2,
        page: 1,
        totalPages: 1,
      };

      (httpService.get as Mock).mockResolvedValue(mockResponse);

      const result = await chatService.getHistory(query);

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(httpService.get).toHaveBeenCalledWith("/chat/history", query);
      expect(result).toEqual(mockResponse);
      expect(result.results).toHaveLength(2);
    });

    it("should fetch history without parameters (empty query)", async () => {
      const query: ChatHistoryQuery = {};

      const mockResponse: PaginatedResponse<ChatMessageResponse> = {
        results: [],
        totalResults: 0,
        page: 1,
        totalPages: 0,
      };

      (httpService.get as Mock).mockResolvedValue(mockResponse);

      const result = await chatService.getHistory(query);

      expect(httpService.get).toHaveBeenCalledWith("/chat/history", query);
      expect(result.results).toHaveLength(0);
    });

    it("should throw error when fetching history fails", async () => {
      const query: ChatHistoryQuery = { page: 1, limit: 10 };
      const mockError = new Error("Failed to fetch history");
      (httpService.get as Mock).mockRejectedValue(mockError);

      await expect(chatService.getHistory(query)).rejects.toThrow(
        "Failed to fetch history",
      );
    });
  });

  describe("clear", () => {
    it("should clear chat history", async () => {
      (httpService.delete as Mock).mockResolvedValue(undefined);

      const result = await chatService.clear();

      expect(httpService.delete).toHaveBeenCalledTimes(1);
      expect(httpService.delete).toHaveBeenCalledWith("/chat/clear");
      expect(result).toBeUndefined();
    });

    it("should throw error when clearing fails", async () => {
      const mockError = new Error("Failed to clear chat");
      (httpService.delete as Mock).mockRejectedValue(mockError);

      await expect(chatService.clear()).rejects.toThrow("Failed to clear chat");
      expect(httpService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
