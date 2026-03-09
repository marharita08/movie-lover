import { AlertTriangleIcon, Bot, User } from "lucide-react";

import { MediaList } from "@/components";
import { MessageAuthor } from "@/const";
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
          isAssistant ? "items-start" : "items-end",
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-3",
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
            <p
              className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap",
                message.isError && "text-error",
              )}
            >
              {message.text}
            </p>
          </div>
        </div>

        {message.mediaItems && message.mediaItems.length > 0 && (
          <div className="w-full">
            <MediaList medias={message.mediaItems} />
          </div>
        )}

        <p className="text-muted-foreground px-1 text-xs">
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
