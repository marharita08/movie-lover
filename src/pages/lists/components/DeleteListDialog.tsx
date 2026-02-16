import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { useDeleteList } from "@/hooks";

interface DeleteListDialogProps {
  listId: string;
  listName: string;
}

export const DeleteListDialog: React.FC<DeleteListDialogProps> = ({
  listId,
  listName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteList, isPending: isDeleting } = useDeleteList();

  const handleConfirm = () => {
    deleteList(listId, {
      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-error"
          disabled={isDeleting}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete List</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-medium">
              Are you sure you want to delete the list "{listName}"?
            </p>
            <p className="text-muted-foreground text-sm">
              This action cannot be undone. All data associated with this list
              will be permanently removed.
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              className="min-w-[120px]"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="min-w-[120px]"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete List
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
