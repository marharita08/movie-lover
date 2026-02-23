import { MutationKey, StorageKey } from "@/const";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useResetPasswordVerify = () => {
  return useAppMutation([MutationKey.RESET_PASSWORD_OTP], {
    mutationFn: authService.verifyResetPassword,
    onSuccess: (data) => {
      localStorage.setItem(StorageKey.RESET_PASSWORD_TOKEN, data.token);
    },
  });
};
