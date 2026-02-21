import { QueryKey } from "@/const";
import { authService } from "@/services";

import { useAppQuery } from "../useAppQuery";

export const useCurrentUser = () => {
  return useAppQuery({
    queryKey: [QueryKey.CURRENT_USER],
    queryFn: authService.getCurrentUser,
  });
};
