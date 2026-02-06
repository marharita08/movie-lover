import { MutationKey } from "@/const";
import { authService } from "@/services/auth.service";

import { useAppMutation } from "./useAppMutation";
import { toast } from "./useToast";

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
