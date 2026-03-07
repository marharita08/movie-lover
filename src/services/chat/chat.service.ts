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
    console.log(query);
    const response = await httpService.get<
      PaginatedResponse<ChatMessageResponse>
    >("/chat/history", query);
    console.log(response);
    return response;
  }

  async clear(): Promise<void> {
    return httpService.delete("/chat/clear");
  }
}

export const chatService = new ChatService();
