import { Button, Input, InputError } from "@/components";
import { StorageKey, TranslationKey } from "@/const";
import { useAppForm, useResetPasswordEmail, useTranslation } from "@/hooks";

import {
  EmailStepValidationSchema,
  type EmailStepValidationSchemaType,
} from "../../validation";

interface EmailStepProps {
  onSuccess: () => void;
}

export const EmailStep: React.FC<EmailStepProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const form = useAppForm<EmailStepValidationSchemaType>({
    schema: EmailStepValidationSchema,
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordEmailMutation = useResetPasswordEmail();

  const handleSubmit = (data: EmailStepValidationSchemaType) => {
    resetPasswordEmailMutation.mutate(data, {
      onSuccess: () => {
        localStorage.setItem(StorageKey.EMAIL, data.email);
        onSuccess();
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
      aria-label="email-step-form"
    >
      <h2 className="text-muted-foreground">
        {t(TranslationKey.RESET_PASSWORD_EMAIL_PROMPT)}
      </h2>
      <div className="flex flex-col gap-1">
        <Input
          {...form.register("email")}
          label={t(TranslationKey.RESET_PASSWORD_EMAIL_LABEL)}
          error={!!form.formState.errors.email?.message}
          placeholder={t(TranslationKey.AUTH_EMAIL_PLACEHOLDER)}
        />
        <InputError error={form.formState.errors.email?.message} />
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Button type="submit" disabled={resetPasswordEmailMutation.isPending}>
          {t(TranslationKey.RESET_PASSWORD_SUBMIT)}
        </Button>
      </div>
    </form>
  );
};
