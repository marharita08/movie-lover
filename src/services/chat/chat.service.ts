import type { ChatMessageValidationSchema } from "@/pages/ai-chat";
import type {
  ChatHistoryQuery,
  ChatMessageResponse,
  PaginatedResponse,
} from "@/types";

import { httpService } from "../http/http.service";

export class ChatService {
  async sendMessage(
    data: ChatMessageValidationSchema,
  ): Promise<ChatMessageResponse> {
    return httpService.post<ChatMessageResponse, ChatMessageValidationSchema>(
      "/chat/message",
      data,
    );
  }

  async getHistory(
    query: ChatHistoryQuery,
  ): Promise<PaginatedResponse<ChatMessageResponse>> {
    return httpService.get<PaginatedResponse<ChatMessageResponse>>(
      "/chat/history",
      query,
    );
  }

  async clear(): Promise<void> {
    return httpService.delete("/chat/clear");
  }
}

export const chatService = new ChatService();
