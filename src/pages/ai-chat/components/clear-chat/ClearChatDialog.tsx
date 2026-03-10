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
import { useClearChat } from "@/hooks";

export const ClearChatDialog = () => {
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
        <Button variant={"destructive"}>
          <Trash2 className="h-4 w-4" />
          Clear Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear chat history?</DialogTitle>
        </DialogHeader>

        <div className="px-4">
          This action cannot be undone. All messages and recommendations will be
          permanently deleted.
        </div>
        <DialogFooter className="p-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={isPending}
          >
            {isPending ? "Clearing..." : "Clear Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
