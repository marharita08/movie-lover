import { Link } from "react-router-dom";

import { Button, Input, InputError } from "@/components";
import { RouterKey, StorageKey } from "@/const";
import { useAppForm, useResetPasswordVerify } from "@/hooks";

import {
  OtpStepValidationSchema,
  type OtpStepValidationSchemaType,
} from "../../validation";

interface OtpStepProps {
  onSuccess: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({ onSuccess }) => {
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
        Enter the code sent to your email
      </h2>
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          value={codeWatch}
          onChange={(e) =>
            form.setValue("code", e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          label="Code"
          placeholder="****"
          className="text-lg tracking-widest"
          error={!!form.formState.errors.code?.message}
        />
        <InputError error={form.formState.errors.code?.message} />
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Button asChild variant={"link"}>
          <Link to={RouterKey.LOGIN}>Back to login</Link>
        </Button>
        <Button type="submit" className="min-w-[150px]">
          Verify
        </Button>
      </div>
    </form>
  );
};
