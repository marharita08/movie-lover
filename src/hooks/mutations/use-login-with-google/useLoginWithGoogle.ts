import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import { useAppMutation } from "@/hooks";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

export const useLoginWithGoogle = () => {
  const { setAccessToken } = useAccessTokenStore();
  const navigate = useNavigate();

  return useAppMutation([MutationKey.LOGIN_WITH_GOOGLE], {
    mutationFn: authService.loginWithGoogle,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      navigate(RouterKey.DASHBOARD);
    },
  });
};
