import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import InputError from "@/components/ui/InputError";
import { Sphere } from "@/components/ui/Sphere";
import { RouterKey, StorageKey } from "@/const";
import { OtpPurpose } from "@/const/otp-purpose";
import { useOtpCountdown } from "@/hooks/useOtpCountdown";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

import {
  EmailVerificationValidationSchema,
  type EmailVerificationValidationSchemaType,
} from "./validation/email-verfication.validation-schema";

export const EmailVerification = () => {
  const email = localStorage.getItem(StorageKey.EMAIL) || "";
  const navigate = useNavigate();

  const { secondsLeft, isFinished, reset } = useOtpCountdown();

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
  }, [email, navigate]);

  const verifyEmailMutation = useVerifyEmail();
  const sendOtpMutation = useSendOtp();

  const handleSubmit = (data: EmailVerificationValidationSchemaType) => {
    verifyEmailMutation.mutate(data);
  };

  const handleResend = () => {
    sendOtpMutation.mutate(
      {
        email,
        purpose: OtpPurpose.EMAIL_VERIFICATION,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  const codeWatch = form.watch("code");

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-28 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <form
        className="bg-card w-full max-w-[500px] rounded-xl p-8 shadow-md"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
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
          <Button type="submit" className="mt-6 w-full">
            Verify
          </Button>
        </div>
        <div className="mt-6 text-center">
          Didn't receive the code?{" "}
          {isFinished ? (
            <Button
              type="button"
              variant="link"
              className="h-fit p-0"
              onClick={handleResend}
            >
              Resend
            </Button>
          ) : (
            <span>Resend available in {secondsLeft} seconds</span>
          )}
        </div>
      </form>
    </div>
  );
};
