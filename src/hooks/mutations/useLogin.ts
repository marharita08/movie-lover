import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../useAppMutation";

export const useLogin = () => {
  const { setAccessToken } = useAccessTokenStore();
  const navigate = useNavigate();

  return useAppMutation([MutationKey.LOGIN], {
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      navigate(RouterKey.DASHBOARD);
    },
  });
};
