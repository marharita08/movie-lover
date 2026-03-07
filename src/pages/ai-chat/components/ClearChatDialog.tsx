import { useQueryClient } from "@tanstack/react-query";
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
import { QueryKey } from "@/const";
import { toast, useClearChat } from "@/hooks";

export const ClearChatDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: clearChat, isPending } = useClearChat();

  const handleClear = () => {
    clearChat(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.CHAT_HISTORY] });
        setOpen(false);
        toast({
          title: "Chat cleared",
          description: "All messages have been deleted.",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash2 className="mr-2 h-4 w-4" />
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
