import { Link } from "react-router-dom";

import { Button, InputError, PasswordInput } from "@/components";
import { RouterKey, StorageKey } from "@/const";
import { useAppForm, useResetPasswordNewPassword } from "@/hooks";

import {
  NewPasswordStepValidationSchema,
  type NewPasswordStepValidationSchemaType,
} from "../../validation";

export const NewPasswordStep = () => {
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
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
      aria-label="new-password-step-form"
    >
      <h2 className="text-muted-foreground">Enter your new password</h2>
      <div className="flex flex-col gap-1">
        <PasswordInput
          {...form.register("password")}
          error={!!form.formState.errors.password?.message}
          placeholder="********"
        />
        <InputError error={form.formState.errors.password?.message} />
      </div>
      <div className="flex flex-col gap-1">
        <PasswordInput
          {...form.register("confirmPassword")}
          label="Confirm Password"
          error={!!form.formState.errors.confirmPassword?.message}
          placeholder="********"
        />
        <InputError error={form.formState.errors.confirmPassword?.message} />
      </div>
      <div className="mt-4 flex items-center justify-end gap-4">
        <Button asChild variant={"link"}>
          <Link to={RouterKey.LOGIN}>Back to login</Link>
        </Button>
        <Button type="submit" className="min-w-[150px]">
          Save
        </Button>
      </div>
    </form>
  );
};
