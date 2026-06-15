import { Button, InputError, PasswordInput } from "@/components";
import { StorageKey, TranslationKey } from "@/const";
import {
  useAppForm,
  useResetPasswordNewPassword,
  useTranslation,
} from "@/hooks";

import {
  NewPasswordStepValidationSchema,
  type NewPasswordStepValidationSchemaType,
} from "../../validation";

export const NewPasswordStep = () => {
  const { t } = useTranslation();

  const form = useAppForm<NewPasswordStepValidationSchemaType>({
    schema: NewPasswordStepValidationSchema,
    defaultValues: {
      email: localStorage.getItem(StorageKey.EMAIL) || "",
      token: localStorage.getItem(StorageKey.RESET_PASSWORD_TOKEN) || "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordNewPasswordMutation = useResetPasswordNewPassword();

  const handleSubmit = (data: NewPasswordStepValidationSchemaType) => {
    const { confirmPassword: _, ...rest } = data;
    resetPasswordNewPasswordMutation.mutate(rest);
  };

  return (
    <form
      data-testid="new-password-step-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
      aria-label="new-password-step-form"
    >
      <h2 className="text-muted-foreground">
        {t(TranslationKey.RESET_PASSWORD_NEW_PROMPT)}
      </h2>

      <div className="flex flex-col gap-1">
        <PasswordInput
          data-testid="password-input"
          {...form.register("password")}
          label={t(TranslationKey.AUTH_PASSWORD)}
          error={!!form.formState.errors.password?.message}
          placeholder="********"
        />
        <InputError error={form.formState.errors.password?.message} />
      </div>

      <div className="flex flex-col gap-1">
        <PasswordInput
          data-testid="confirm-password-input"
          {...form.register("confirmPassword")}
          label={t(TranslationKey.RESET_PASSWORD_CONFIRM_LABEL)}
          error={!!form.formState.errors.confirmPassword?.message}
          placeholder="********"
        />
        <InputError error={form.formState.errors.confirmPassword?.message} />
      </div>

      <div className="mt-4 flex items-center justify-end gap-4">
        <Button
          data-testid="submit-button"
          type="submit"
          className="min-w-37.5"
          disabled={resetPasswordNewPasswordMutation.isPending}
        >
          {t(TranslationKey.RESET_PASSWORD_SAVE)}
        </Button>
      </div>
    </form>
  );
};
