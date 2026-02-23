import { MutationKey } from "@/const";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

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
