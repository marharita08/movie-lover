import { RouterKey, StorageKey } from "@/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type EmailVerificationValidationSchemaType,
  EmailVerificationValidationSchema,
} from "./validation/email-verfication.validation-schema";
import { Input } from "@/components/ui/Input";
import InputError from "@/components/ui/InputError";
import { Button } from "@/components/ui/Button";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sphere } from "@/components/ui/Sphere";

export const EmailVerification = () => {
  const email = localStorage.getItem(StorageKey.EMAIL) || "";
  const navigate = useNavigate();

  const form = useForm<EmailVerificationValidationSchemaType>({
    resolver: zodResolver(EmailVerificationValidationSchema),
    defaultValues: {
      email,
      code: "",
    },
  });

  useEffect(() => {
    if (!email) {
      navigate(RouterKey.LOGIN);
    }
  });

  const verifyEmailMutation = useVerifyEmail();

  const handleSubmit = (data: EmailVerificationValidationSchemaType) => {
    verifyEmailMutation.mutate(data);
  };

  const codeWatch = form.watch("code");

  return (
    <div className="flex justify-center items-center h-screen bg-primary-900 overflow-hidden relative">
      <Sphere className="w-10 h-10 absolute bottom-40 left-50" />
      <Sphere className="w-15 h-15 absolute top-20 left-30" />
      <Sphere className="w-13 h-13 absolute top-28 left-[calc(50%+7.5rem)]" />
      <Sphere className="w-20 h-20 absolute bottom-20 right-40" />
      <form
        className="bg-card p-8 w-full max-w-[500px] rounded-xl shadow-md"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Email Verification
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              value={codeWatch}
              onChange={(e) =>
                form.setValue(
                  "code",
                  e.target.value.replace(/\D/g, "").slice(0, 4),
                )
              }
              label="Code"
              placeholder="****"
              className="text-lg tracking-widest"
              error={!!form.formState.errors.code?.message}
            />
            <InputError error={form.formState.errors.code?.message} />
          </div>
          <Button type="submit" className="w-full mt-6">
            Verify
          </Button>
        </div>
      </form>
    </div>
  );
};
