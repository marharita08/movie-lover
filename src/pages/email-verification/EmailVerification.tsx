import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button, Input, InputError, Sphere } from "@/components";
import { OtpPurpose, RouterKey, StorageKey, TranslationKey } from "@/const";
import {
  useAppForm,
  useOtpCountdown,
  useSendOtp,
  useTranslation,
  useVerifyEmail,
} from "@/hooks";

import {
  EmailVerificationValidationSchema,
  type EmailVerificationValidationSchemaType,
} from "./validation";

export const EmailVerification = () => {
  const email = localStorage.getItem(StorageKey.EMAIL) || "";
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { secondsLeft, isFinished, reset } = useOtpCountdown();

  const form = useAppForm<EmailVerificationValidationSchemaType>({
    schema: EmailVerificationValidationSchema,
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

  const codeWatch = useWatch({
    control: form.control,
    name: "code",
  });

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-28 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <form
        className="bg-card w-full max-w-[500px] rounded-xl p-8 shadow-md"
        onSubmit={form.handleSubmit(handleSubmit)}
        aria-label="email-verification-form"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
          {t(TranslationKey.AUTH_EMAIL_VERIFICATION_TITLE)}
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
              label={t(TranslationKey.AUTH_CODE)}
              placeholder="****"
              className="text-lg tracking-widest"
              error={!!form.formState.errors.code?.message}
            />
            <InputError error={form.formState.errors.code?.message} />
          </div>
          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={verifyEmailMutation.isPending}
          >
            {t(TranslationKey.AUTH_VERIFY)}
          </Button>
        </div>
        <div className="mt-6 text-center">
          {t(TranslationKey.AUTH_DIDNT_RECEIVE_CODE)}{" "}
          {isFinished ? (
            <Button
              type="button"
              variant="link"
              className="h-fit p-0"
              onClick={handleResend}
            >
              {t(TranslationKey.AUTH_RESEND)}
            </Button>
          ) : (
            <span>
              {t(TranslationKey.AUTH_RESEND_AVAILABLE_IN)} {secondsLeft}{" "}
              {t(TranslationKey.AUTH_SECONDS)}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
