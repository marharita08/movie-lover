import { MutationKey, RouterKey } from "@/const";
import { useAppMutation } from "./useAppMutation";
import { authService } from "@/services/auth.service";
import { useAccessTokenStore } from "@/store/access-token.store";
import { useNavigate } from "react-router-dom";

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
}
