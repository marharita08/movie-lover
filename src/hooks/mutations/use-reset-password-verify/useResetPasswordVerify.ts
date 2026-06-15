import { MutationKey, StorageKey } from "@/const";
import type { OtpStepValidationSchemaType } from "@/pages";
import { authService } from "@/services";
import { useLanguageStore } from "@/store/language.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useResetPasswordVerify = () => {
  const { language } = useLanguageStore();
  return useAppMutation([MutationKey.RESET_PASSWORD_OTP], {
    mutationFn: (data: OtpStepValidationSchemaType) =>
      authService.verifyResetPassword(data, { language }),
    onSuccess: (data) => {
      localStorage.setItem(StorageKey.RESET_PASSWORD_TOKEN, data.token);
    },
  });
};
