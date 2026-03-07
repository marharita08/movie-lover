import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

import { Button, Textarea } from "@/components";
import { QueryKey } from "@/const";
import { useSendMessage } from "@/hooks";

interface MessageInputProps {
  pendingMessage: string | null;
  onPendingMessageChange: (message: string | null) => void;
}

export const MessageInput = ({
  pendingMessage,
  onPendingMessageChange,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const sendMessageMutation = useSendMessage();

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !pendingMessage) {
      onPendingMessageChange(trimmedMessage);
      setMessage("");

      sendMessageMutation.mutate(
        { message: trimmedMessage },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [QueryKey.CHAT_HISTORY],
            });
            onPendingMessageChange(null);
          },
          onError: () => {
            onPendingMessageChange(null);
          },
        },
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 p-4">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for recommendations... (e.g., 'Recommend me something similar to Inception')"
          disabled={!!pendingMessage}
          className="max-h-[200px] min-h-[60px] resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || !!pendingMessage}
          size="icon"
          className="h-[60px] w-[60px] shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
