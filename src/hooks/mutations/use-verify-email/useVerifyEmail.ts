import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey, StorageKey } from "@/const";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useVerifyEmail = () => {
  const { setAccessToken } = useAccessTokenStore();
  const navigate = useNavigate();

  return useAppMutation([MutationKey.VERIFY_EMAIL], {
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      localStorage.removeItem(StorageKey.EMAIL);
      navigate(RouterKey.DASHBOARD);
    },
  });
};
