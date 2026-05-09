import { MutationKey, TranslationKey } from "@/const";
import { useTranslation } from "@/hooks";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useChangePassword = () => {
  const { t } = useTranslation();

  return useAppMutation([MutationKey.CHANGE_PASSWORD], {
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast({
        title: t(TranslationKey.USER_PROFILE_CHANGE_PASSWORD_SUCCESS),
        variant: "success",
      });
    },
  });
};
