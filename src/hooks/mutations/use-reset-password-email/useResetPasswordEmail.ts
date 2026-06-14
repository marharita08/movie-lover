import { MutationKey } from "@/const";
import type { EmailStepValidationSchemaType } from "@/pages";
import { authService } from "@/services";
import { useLanguageStore } from "@/store/language.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useResetPasswordEmail = () => {
  const { language } = useLanguageStore();
  return useAppMutation([MutationKey.RESET_PASSWORD_EMAIL], {
    mutationFn: (data: EmailStepValidationSchemaType) =>
      authService.forgotPassword(data, { language }),
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
      });
    },
  });
};
