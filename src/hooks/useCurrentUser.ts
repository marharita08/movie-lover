import { QueryKey } from "@/const/query-key";
import { authService } from "@/services/auth.service";

import { useAppQuery } from "./useAppQuery";

export const useCurrentUser = () => {
  return useAppQuery({
    queryKey: [QueryKey.CURRENT_USER],
    queryFn: authService.getCurrentUser,
  });
};
