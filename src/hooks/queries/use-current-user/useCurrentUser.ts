import { QueryKey } from "@/const";
import { authService } from "@/services";
import { useAccessTokenStore } from "@/store/access-token.store";

import { useAppQuery } from "../../use-app-query/useAppQuery";

export const useCurrentUser = () => {
  const accessToken = useAccessTokenStore((state) => state.accessToken);

  return useAppQuery({
    queryKey: [QueryKey.CURRENT_USER],
    queryFn: authService.getCurrentUser,
    enabled: !!accessToken,
  });
};
