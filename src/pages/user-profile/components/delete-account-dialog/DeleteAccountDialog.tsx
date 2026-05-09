import { TrashIcon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Loading,
} from "@/components";
import { TranslationKey } from "@/const";
import { useDeleteAccount, useTranslation } from "@/hooks";

export const DeleteAccountDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const { t } = useTranslation();

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
          {t(TranslationKey.USER_PROFILE_DELETE_ACCOUNT)}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(TranslationKey.USER_PROFILE_DELETE_CONFIRM_TITLE)}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-medium">
              {t(TranslationKey.USER_PROFILE_DELETE_CONFIRM_TEXT)}
            </p>
            <p>{t(TranslationKey.USER_PROFILE_DELETE_CONFIRM_SUBTEXT)}</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              className="min-w-[120px]"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t(TranslationKey.USER_PROFILE_DELETE_CANCEL)}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loading size="sm" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
              {isDeleting
                ? t(TranslationKey.USER_PROFILE_DELETE_DELETING)
                : t(TranslationKey.USER_PROFILE_DELETE_ACCOUNT)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
