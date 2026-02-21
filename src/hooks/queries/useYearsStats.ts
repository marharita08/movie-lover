import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { listService } from "@/services";

export const useYearsStats = (listId: string) => {
  return useQuery({
    queryKey: [QueryKey.YEARS_STATS, listId],
    queryFn: () => listService.getYearsStats(listId),
  });
};
