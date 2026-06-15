import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import { useAppMutation } from "@/hooks";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";
import { useLanguageStore } from "@/store/language.store";
import type { LoginWithGoogleBody } from "@/types";

export const useLoginWithGoogle = () => {
  const { setAccessToken } = useAccessTokenStore();
  const { setLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const { language } = useLanguageStore();

  return useAppMutation([MutationKey.LOGIN_WITH_GOOGLE], {
    mutationFn: (data: LoginWithGoogleBody) =>
      authService.loginWithGoogle(data, { language }),
    onSuccess: (data) => {
      setLanguage(data.language);
      setAccessToken(data.accessToken);
      navigate(RouterKey.DASHBOARD);
    },
  });
};
