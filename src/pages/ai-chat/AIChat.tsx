import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "@/components";
import { TranslationKey } from "@/const";
import { useLists, useTranslation } from "@/hooks";

import { ClearChatDialog, MessageInput, MessageList } from "./components";

export const AIChat = () => {
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const { data: lists } = useLists({});
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">
            {t(TranslationKey.AI_CHAT_TITLE)}
          </h2>
          {lists && lists?.pages[0].totalResults === 0 && (
            <Popover>
              <PopoverTrigger className="sm:hidden">
                <div className="bg-warning text-warning-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <AlertTriangleIcon className="h-5 w-5" />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                {t(TranslationKey.AI_CHAT_UPLOAD_PROMPT)}
              </PopoverContent>
            </Popover>
          )}
        </div>

        {lists && lists?.pages[0].totalResults === 0 && (
          <div className="bg-warning/10 hidden flex-1 items-center gap-4 rounded-md px-4 py-3 sm:flex">
            <div className="bg-warning text-warning-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <AlertTriangleIcon className="h-5 w-5" />
            </div>
            <div>{t(TranslationKey.AI_CHAT_UPLOAD_PROMPT)}</div>
          </div>
        )}

        <ClearChatDialog />
      </div>

      <Separator />

      <MessageList pendingMessage={pendingMessage} />

      <Separator />

      <MessageInput
        pendingMessage={pendingMessage}
        onPendingMessageChange={setPendingMessage}
      />
    </div>
  );
};
