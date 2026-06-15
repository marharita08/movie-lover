import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { TranslationKey } from "@/const";
import { useClearChat, useTranslation } from "@/hooks";

export const ClearChatDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutate: clearChat, isPending } = useClearChat();

  const handleClear = () => {
    clearChat(undefined, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} data-testid="clear-chat-trigger-button">
          <Trash2 className="h-4 w-4" />
          {t(TranslationKey.AI_CHAT_CLEAR_CONFIRM)}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="clear-chat-dialog-title">
            {t(TranslationKey.AI_CHAT_CLEAR_CONFIRM_TITLE)}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4" data-testid="clear-chat-dialog-description">
          {t(TranslationKey.AI_CHAT_CLEAR_CONFIRM_DESC)}
        </div>

        <DialogFooter className="p-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            data-testid="clear-chat-cancel-button"
          >
            {t(TranslationKey.AI_CHAT_CLEAR_CANCEL)}
          </Button>

          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={isPending}
            data-testid="clear-chat-confirm-button"
          >
            {isPending
              ? t(TranslationKey.AI_CHAT_CLEARING)
              : t(TranslationKey.AI_CHAT_CLEAR_CONFIRM)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
