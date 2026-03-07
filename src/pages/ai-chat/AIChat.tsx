import { useState } from "react";

import { Separator } from "@/components";

import { ClearChatDialog, MessageInput, MessageList } from "./components";

export const AIChat = () => {
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <h2 className="text-xl font-bold">AI Chat</h2>
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
