import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { removeAccessToken } = useAccessTokenStore();

  return useAppMutation([MutationKey.DELETE_ACCOUNT], {
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      removeAccessToken();
      navigate(RouterKey.LOGIN);
      toast({
        title: "Account deleted successfully",
        variant: "success",
      });
    },
  });
};
