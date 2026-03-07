import { QueryKey } from "@/const";
import { useAppInfiniteQuery } from "@/hooks";
import { chatService } from "@/services";
import type { ChatHistoryQuery } from "@/types";

export const useChatHistory = (query: ChatHistoryQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.CHAT_HISTORY, query],
    queryFn: ({ pageParam = 1 }) =>
      chatService.getHistory({ ...query, page: pageParam }),
  });
};
