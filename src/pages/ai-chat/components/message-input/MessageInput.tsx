import { Send } from "lucide-react";
import { type KeyboardEvent } from "react";

import { Button, InputError, Textarea } from "@/components";
import { TranslationKey } from "@/const";
import {
  useAppForm,
  useIsMobile,
  useSendMessage,
  useTranslation,
} from "@/hooks";
import {
  type ChatMessageValidationSchema,
  chatMessageValidationSchema,
} from "@/pages/ai-chat";

interface MessageInputProps {
  pendingMessage: string | null;
  onPendingMessageChange: (message: string | null) => void;
}

export const MessageInput = ({
  pendingMessage,
  onPendingMessageChange,
}: MessageInputProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const form = useAppForm({
    schema: chatMessageValidationSchema,
    defaultValues: {
      message: "",
    },
  });

  const sendMessageMutation = useSendMessage();

  const handleSend = (data: ChatMessageValidationSchema) => {
    const trimmedMessage = data.message.trim();
    if (trimmedMessage && !pendingMessage) {
      onPendingMessageChange(trimmedMessage);

      sendMessageMutation.mutate(
        { message: trimmedMessage },
        {
          onSuccess: () => {
            form.reset();
          },
          onSettled: () => {
            onPendingMessageChange(null);
          },
        },
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSend)();
    }
  };

  return (
    <div className="shrink-0 p-4">
      <form
        onSubmit={form.handleSubmit(handleSend)}
        className="flex flex-col gap-1"
      >
        <div className="flex gap-2">
          <Textarea
            {...form.register("message")}
            onKeyDown={handleKeyDown}
            placeholder={t(
              isMobile
                ? TranslationKey.AI_CHAT_INPUT_PLACEHOLDER_SHORT
                : TranslationKey.AI_CHAT_INPUT_PLACEHOLDER,
            )}
            disabled={!!pendingMessage}
            className="max-h-[200px] min-h-[60px] resize-none"
            rows={2}
            aria-label={t(TranslationKey.AI_CHAT_INPUT_ARIA)}
          />
          <Button
            type="submit"
            disabled={!form.watch("message").trim() || !!pendingMessage}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
            aria-label={t(TranslationKey.AI_CHAT_SEND_ARIA)}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <InputError error={form.formState.errors.message?.message} />
      </form>
    </div>
  );
};
