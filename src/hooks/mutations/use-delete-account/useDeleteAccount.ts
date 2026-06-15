import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey, TranslationKey } from "@/const";
import { useTranslation } from "@/hooks";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { removeAccessToken } = useAccessTokenStore();
  const { t } = useTranslation();

  return useAppMutation([MutationKey.DELETE_ACCOUNT], {
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      removeAccessToken();
      navigate(RouterKey.LOGIN);
      toast({
        title: t(TranslationKey.USER_PROFILE_DELETE_SUCCESS),
        variant: "success",
      });
    },
  });
};
