import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey } from "@/const";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useLogout = () => {
  const { removeAccessToken } = useAccessTokenStore();
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.LOGOUT], {
    mutationFn: authService.logout,
    onSuccess: () => {
      removeAccessToken();
      queryClient.invalidateQueries({ queryKey: [QueryKey.CURRENT_USER] });
    },
  });
};
