import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input, InputError } from "@/components";
import { RouterKey, StorageKey } from "@/const";
import { useResetPasswordEmail } from "@/hooks";

import {
  EmailStepValidationSchema,
  type EmailStepValidationSchemaType,
} from "../validation/email-step.validation-schema";
import { Link } from "react-router-dom";

interface EmailStepProps {
  onSuccess: () => void;
}

export const EmailStep: React.FC<EmailStepProps> = ({ onSuccess }) => {
  const form = useForm<EmailStepValidationSchemaType>({
    resolver: zodResolver(EmailStepValidationSchema),
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
    >
      <h2 className="text-muted-foreground">
        Enter your email to reset your password
      </h2>
      <div className="flex flex-col gap-1">
        <Input
          {...form.register("email")}
          label="Email"
          error={!!form.formState.errors.email?.message}
          placeholder="jane.smith@example.com"
        />
        <InputError error={form.formState.errors.email?.message} />
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Button asChild variant={"link"}>
          <Link to={RouterKey.LOGIN}>Back to login</Link>
        </Button>
        <Button type="submit">Reset Password</Button>
      </div>
    </form>
  );
};
