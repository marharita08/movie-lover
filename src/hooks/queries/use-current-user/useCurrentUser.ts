import { QueryKey } from "@/const";
import { authService } from "@/services";

import { useAppQuery } from "../../use-app-query/useAppQuery";

export const useCurrentUser = () => {
  return useAppQuery({
    queryKey: [QueryKey.CURRENT_USER],
    queryFn: authService.getCurrentUser,
  });
};
