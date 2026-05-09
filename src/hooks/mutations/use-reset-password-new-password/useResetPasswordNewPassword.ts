import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey, StorageKey, TranslationKey } from "@/const";
import { useTranslation } from "@/hooks/use-translation/useTranslation";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useResetPasswordNewPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useAppMutation([MutationKey.RESET_PASSWORD_NEW_PASSWORD], {
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast({
        title: t(TranslationKey.RESET_PASSWORD_SUCCESS),
        variant: "success",
      });
      localStorage.removeItem(StorageKey.RESET_PASSWORD_TOKEN);
      localStorage.removeItem(StorageKey.EMAIL);
      localStorage.removeItem(StorageKey.RESET_PASSWORD_STEP);
      navigate(RouterKey.LOGIN);
    },
  });
};
