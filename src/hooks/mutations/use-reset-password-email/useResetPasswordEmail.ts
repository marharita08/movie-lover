import { MutationKey } from "@/const";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useResetPasswordEmail = () => {
  return useAppMutation([MutationKey.RESET_PASSWORD_EMAIL], {
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
      });
    },
  });
};
