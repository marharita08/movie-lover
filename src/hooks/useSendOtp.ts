import { MutationKey } from "@/const";
import { useAppMutation } from "./useAppMutation";
import { authService } from "@/services/auth.service";
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
