import { MutationKey } from "@/const";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useSendOtp = () => {
  return useAppMutation([MutationKey.SEND_OTP], {
    mutationFn: authService.sendOtp,
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
      });
    },
  });
};
