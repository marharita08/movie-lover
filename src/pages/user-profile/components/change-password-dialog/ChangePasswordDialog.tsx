import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  InputError,
  PasswordInput,
} from "@/components";
import { TranslationKey } from "@/const";
import { useAppForm, useChangePassword, useTranslation } from "@/hooks";

import {
  ChangePasswordValidationSchema,
  type ChangePasswordValidationSchemaType,
} from "../../validation";

export const ChangePasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const form = useAppForm<ChangePasswordValidationSchemaType>({
    schema: ChangePasswordValidationSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const changePasswordMutation = useChangePassword();

  const handleSubmit = (data: ChangePasswordValidationSchemaType) => {
    const { confirmPassword: _, ...rest } = data;
    changePasswordMutation.mutate(rest, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-sm">
          <LockIcon className="h-4 w-4" />
          {t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD)}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD_TITLE)}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 p-4"
          aria-label="change-password-form"
        >
          <div className="flex flex-col gap-1">
            <PasswordInput
              {...form.register("password")}
              label={t(TranslationKey.AUTH_PASSWORD)}
              error={!!form.formState.errors.password?.message}
              placeholder="********"
            />
            <InputError error={form.formState.errors.password?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <PasswordInput
              {...form.register("confirmPassword")}
              label={t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD_CONFIRM)}
              error={!!form.formState.errors.confirmPassword?.message}
              placeholder="********"
            />
            <InputError
              error={form.formState.errors.confirmPassword?.message}
            />
          </div>
          <div className="mt-4 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[120px]"
              onClick={() => setOpen(false)}
            >
              {t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD_CANCEL)}
            </Button>
            <Button
              type="submit"
              className="min-w-[120px]"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD_SAVING)
                : t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD_SAVE)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
