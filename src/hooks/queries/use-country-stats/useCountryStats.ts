import { QueryKey } from "@/const";
import { useAppQuery } from "@/hooks/use-app-query/useAppQuery";
import { listService } from "@/services/list/list.service";

export const useCountryStats = (listId: string) => {
  return useAppQuery({
    queryKey: [QueryKey.COUNTRY_STATS, listId],
    queryFn: () => listService.getCountryStats(listId),
  });
};
