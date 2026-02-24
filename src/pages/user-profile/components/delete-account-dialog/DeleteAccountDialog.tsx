import { TrashIcon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { useDeleteAccount } from "@/hooks";

export const DeleteAccountDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const handleConfirm = () => {
    deleteAccount(undefined, {
      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className="hover:text-error text-sm"
        >
          <TrashIcon className="h-4 w-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-medium">
              Are you sure you want to delete your account?
            </p>
            <p>
              This action is irreversible and will permanently delete your
              account and all associated data.
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
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              <TrashIcon className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
