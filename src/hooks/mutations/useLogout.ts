import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import { authService } from "@/services/auth.service";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../useAppMutation";

export const useLogout = () => {
  const navigate = useNavigate();
  const { removeAccessToken } = useAccessTokenStore();

  return useAppMutation([MutationKey.LOGOUT], {
    mutationFn: authService.logout,
    onSuccess: () => {
      removeAccessToken();
      navigate(RouterKey.LOGIN);
    },
  });
};
