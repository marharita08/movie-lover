import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Sphere } from "@/components";
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

  const navigate = useNavigate();

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-18 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <main className="bg-card flex h-full w-full flex-col gap-4 p-8 shadow-md sm:h-fit sm:w-[500px] sm:rounded-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <Button
            variant="ghost"
            className="justify-self-start p-0"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Button>

          <h1 className="text-center text-2xl font-bold">Reset Password</h1>

          <div />
        </div>
        <div>{StepToComponent[step]}</div>
      </main>
    </div>
  );
};
