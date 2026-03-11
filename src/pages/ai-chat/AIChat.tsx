import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";

import { Separator } from "@/components";
import { useLists } from "@/hooks";

import { ClearChatDialog, MessageInput, MessageList } from "./components";

export const AIChat = () => {
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const { data: lists } = useLists({});

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-4">
        <h2 className="text-xl font-bold">AI Chat</h2>
        {lists && lists?.pages[0].totalResults === 0 && (
          <div className="bg-warning/10 flex flex-1 items-center gap-4 rounded-md px-4 py-3">
            <div
              className={
                "bg-warning text-warning-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              }
            >
              <AlertTriangleIcon className="h-5 w-5" />
            </div>
            <div>
              Upload your IMDb list to get more personalized recommendations.
            </div>
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
