import { authService } from "@/services/auth.service";
import { useAppQuery } from "./useAppQuery";
import { QueryKey } from "@/const/query-key";

export const useCurrentUser = () => {
  return useAppQuery({
    queryKey: [QueryKey.CURRENT_USER],
    queryFn: authService.getCurrentUser,
  });
};
