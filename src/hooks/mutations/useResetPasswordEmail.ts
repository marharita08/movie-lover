import { MutationKey } from "@/const";
import { authService } from "@/services";

import { useAppMutation } from "../useAppMutation";
import { toast } from "../useToast";

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
