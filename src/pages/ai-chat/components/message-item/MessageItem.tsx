import { AlertTriangleIcon, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { MediaList } from "@/components";
import { MessageAuthor, StorageKey } from "@/const";
import type { ChatMessageResponse } from "@/types";
import { cn, formatDateTime } from "@/utils";

interface MessageItemProps {
  message: ChatMessageResponse;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAssistant = message.author === MessageAuthor.ASSISTANT;

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "justify-start" : "justify-end",
      )}
    >
      {isAssistant && (
        <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] space-y-3",
          isAssistant ? "w-[80%] items-start" : "items-end",
        )}
      >
        <div
          className={cn(
            "w-fit rounded-lg px-4 py-3",
            isAssistant
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            {message.isError && (
              <div
                className={
                  "bg-error text-error-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                }
              >
                <AlertTriangleIcon className="h-5 w-5" />
              </div>
            )}
            <div
              className={cn(
                "text-sm leading-relaxed",
                message.isError && "text-error",
              )}
              data-testid={`message-text-${message.id}`}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="my-0.5 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-1 list-disc pl-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-1 list-decimal pl-4">{children}</ol>
                  ),
                  li: ({ children }) => <li className="my-0">{children}</li>,
                  code: ({ children }) => (
                    <code className="rounded bg-black/10 px-1 text-xs">
                      {children}
                    </code>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {message.mediaItems && message.mediaItems.length > 0 && (
          <div className="w-full">
            <MediaList
              medias={message.mediaItems}
              storageKey={`${StorageKey.MESSAGE_MEDIA_ITEMS}_${message.id}`}
            />
          </div>
        )}

        <p
          className="text-muted-foreground px-1 text-xs"
          data-testid={`message-time-${message.id}`}
        >
          {formatDateTime(message.createdAt)}
        </p>
      </div>

      {!isAssistant && (
        <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};
