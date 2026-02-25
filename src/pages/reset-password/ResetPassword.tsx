import { useEffect, useState } from "react";

import { Sphere } from "@/components";
import { StorageKey } from "@/const";

import { EmailStep, NewPasswordStep, OtpStep } from "./components";
import { ResetPasswordStep } from "./const";

export const ResetPassword = () => {
  const initialStep =
    (localStorage.getItem(
      StorageKey.RESET_PASSWORD_STEP,
    ) as ResetPasswordStep) || ResetPasswordStep.EMAIL;
  const [step, setStep] = useState<ResetPasswordStep>(initialStep);

  useEffect(() => {
    localStorage.setItem(StorageKey.RESET_PASSWORD_STEP, step);
  }, [step]);

  const StepToComponent = {
    [ResetPasswordStep.EMAIL]: (
      <EmailStep onSuccess={() => setStep(ResetPasswordStep.OTP)} />
    ),
    [ResetPasswordStep.OTP]: (
      <OtpStep onSuccess={() => setStep(ResetPasswordStep.NEW_PASSWORD)} />
    ),
    [ResetPasswordStep.NEW_PASSWORD]: <NewPasswordStep />,
  };

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-18 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <main className="bg-card flex h-full w-full flex-col gap-4 p-8 shadow-md sm:h-fit sm:w-[500px] sm:rounded-xl">
        <h1 className="text-center text-2xl font-bold">Reset Password</h1>
        <div>{StepToComponent[step]}</div>
      </main>
    </div>
  );
};
