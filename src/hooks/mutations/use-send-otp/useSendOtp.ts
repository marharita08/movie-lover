import { MutationKey } from "@/const";
import { authService } from "@/services";
import { useLanguageStore } from "@/store/language.store";
import type { SendOtpRequest } from "@/types";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useSendOtp = () => {
  const { language } = useLanguageStore();
  return useAppMutation([MutationKey.SEND_OTP], {
    mutationFn: (data: SendOtpRequest) =>
      authService.sendOtp(data, { language }),
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
      });
    },
  });
};
