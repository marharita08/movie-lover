import { Bot } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { Loading, LoadingBubbles } from "@/components";
import { MessageAuthor } from "@/const";
import { useChatHistory } from "@/hooks";
import { type ChatMessageResponse } from "@/types";

import { MessageItem } from "../message-item/MessageItem";

interface MessageListProps {
  pendingMessage?: string | null;
}

export const MessageList = ({ pendingMessage }: MessageListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const isInitialScrollDone = useRef(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatHistory({});

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollHeightBefore = container.scrollHeight;
        const scrollTopBefore = container.scrollTop;

        fetchNextPage().then(() => {
          requestAnimationFrame(() => {
            if (container) {
              const scrollHeightAfter = container.scrollHeight;
              container.scrollTop =
                scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
            }
          });
        });
      }
    },
  });

  const allMessages = useMemo(
    () => data?.pages.flatMap((page) => page.results).reverse() ?? [],
    [data],
  );

  useEffect(() => {
    if (!isLoading && allMessages.length > 0 && !isInitialScrollDone.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
        isInitialScrollDone.current = true;
        lastMessageIdRef.current = allMessages[allMessages.length - 1]?.id;
      }, 0);
    }
  }, [isLoading, allMessages]);

  useEffect(() => {
    if (allMessages.length > 0 && isInitialScrollDone.current) {
      const lastMessage = allMessages[allMessages.length - 1];
      if (lastMessage && lastMessage.id !== lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMessage.id;
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    }
  }, [allMessages]);

  useEffect(() => {
    if (pendingMessage && isInitialScrollDone.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [pendingMessage]);

  const optimisticUserMessage: ChatMessageResponse | null = pendingMessage
    ? {
        id: "__optimistic__",
        text: pendingMessage,
        author: MessageAuthor.USER,
        mediaItems: null,
        createdAt: new Date().toISOString(),
      }
    : null;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <Loading />
      </div>
    );
  }

  if (allMessages.length === 0 && !pendingMessage) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
      {hasNextPage && (
        <div ref={loadMoreRef} className="mb-4 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center">
              <Loading />
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {allMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {optimisticUserMessage && (
          <MessageItem message={optimisticUserMessage} />
        )}

        {pendingMessage && (
          <div className="flex justify-start gap-3">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <LoadingBubbles />
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};
