import { MutationKey } from "@/const";
import { authService } from "@/services/auth.service";

import { useAppMutation } from "../useAppMutation";
import { toast } from "../useToast";

export const useChangePassword = () =>
  useAppMutation([MutationKey.CHANGE_PASSWORD], {
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast({
        title: "Password changed successfully",
        variant: "success",
      });
    },
  });
