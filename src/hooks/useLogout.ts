import { authService } from "@/services/auth.service";
import { useAppMutation } from "./useAppMutation";
import { MutationKey, RouterKey } from "@/const";
import { useNavigate } from "react-router-dom";
import { useAccessTokenStore } from "@/store/access-token.store";

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
