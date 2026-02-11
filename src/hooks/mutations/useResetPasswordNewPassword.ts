import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey, StorageKey } from "@/const";
import { authService } from "@/services/auth.service";

import { useAppMutation } from "../useAppMutation";
import { toast } from "../useToast";

export const useResetPasswordNewPassword = () => {
  const navigate = useNavigate();

  return useAppMutation([MutationKey.RESET_PASSWORD_NEW_PASSWORD], {
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast({
        title: "Password reset successfully",
        variant: "success",
      });
      localStorage.removeItem(StorageKey.RESET_PASSWORD_TOKEN);
      navigate(RouterKey.LOGIN);
    },
  });
};
