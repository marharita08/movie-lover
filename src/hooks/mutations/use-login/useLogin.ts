import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import type { LoginValidationSchemaType } from "@/pages";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";
import { useLanguageStore } from "@/store/language.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useLogin = () => {
  const { setAccessToken } = useAccessTokenStore();
  const { language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();

  return useAppMutation([MutationKey.LOGIN], {
    mutationFn: (data: LoginValidationSchemaType) =>
      authService.login(data, { language }),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setLanguage(data.language);
      navigate(RouterKey.DASHBOARD);
    },
  });
};
