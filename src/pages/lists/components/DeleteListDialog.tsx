import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Loading,
} from "@/components";
import { TranslationKey } from "@/const";
import { useDeleteList, useTranslation } from "@/hooks";

interface DeleteListDialogProps {
  listId: string;
  listName: string;
}

export const DeleteListDialog: React.FC<DeleteListDialogProps> = ({
  listId,
  listName,
}) => {
  const { t } = useTranslation();
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
          <DialogTitle>
            {t(TranslationKey.DELETE_LIST_CONFIRM_TITLE)}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <DialogDescription className="flex flex-col gap-1">
            <span
              className="font-medium"
              data-testid="delete-list-confirm-text"
            >
              {t(TranslationKey.DELETE_LIST_CONFIRM_TEXT).replace(
                "{{listName}}",
                listName,
              )}
            </span>
            <span
              className="text-muted-foreground text-sm"
              data-testid="delete-list-confirm-subtext"
            >
              {t(TranslationKey.DELETE_LIST_CONFIRM_SUBTEXT)}
            </span>
          </DialogDescription>
          <div className="flex justify-end gap-4">
            <Button
              className="min-w-[120px]"
              variant="outline"
              onClick={() => setIsOpen(false)}
              data-testid="delete-list-cancel"
            >
              {t(TranslationKey.DELETE_LIST_CANCEL)}
            </Button>
            <Button
              variant="destructive"
              className="min-w-[120px]"
              onClick={handleConfirm}
              disabled={isDeleting}
              data-testid="delete-list-confirm"
            >
              {isDeleting ? (
                <Loading size="sm" />
              ) : (
                <Trash2Icon className="mr-2 h-4 w-4" />
              )}
              {isDeleting
                ? t(TranslationKey.DELETE_LIST_DELETING)
                : t(TranslationKey.DELETE_LIST_DELETE)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
