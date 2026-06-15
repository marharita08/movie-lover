import { Button, Input, InputError } from "@/components";
import { StorageKey, TranslationKey } from "@/const";
import { useAppForm, useResetPasswordVerify, useTranslation } from "@/hooks";

import {
  OtpStepValidationSchema,
  type OtpStepValidationSchemaType,
} from "../../validation";

interface OtpStepProps {
  onSuccess: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const form = useAppForm<OtpStepValidationSchemaType>({
    schema: OtpStepValidationSchema,
    defaultValues: {
      code: "",
      email: localStorage.getItem(StorageKey.EMAIL) || "",
    },
  });
  const codeWatch = form.watch("code");

  const resetPasswordVerifyMutation = useResetPasswordVerify();

  const handleSubmit = (data: OtpStepValidationSchemaType) => {
    resetPasswordVerifyMutation.mutate(data, {
      onSuccess,
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
      aria-label="otp-step-form"
    >
      <h2 className="text-muted-foreground">
        {t(TranslationKey.RESET_PASSWORD_OTP_PROMPT)}
      </h2>
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          value={codeWatch}
          onChange={(e) =>
            form.setValue("code", e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          label={t(TranslationKey.RESET_PASSWORD_OTP_LABEL)}
          placeholder="****"
          className="text-lg tracking-widest"
          error={!!form.formState.errors.code?.message}
        />
        <InputError error={form.formState.errors.code?.message} />
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Button
          type="submit"
          className="min-w-[150px]"
          disabled={resetPasswordVerifyMutation.isPending}
        >
          {t(TranslationKey.RESET_PASSWORD_VERIFY)}
        </Button>
      </div>
    </form>
  );
};
