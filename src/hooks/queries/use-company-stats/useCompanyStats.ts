import { QueryKey } from "@/const";
import { useAppQuery } from "@/hooks/use-app-query/useAppQuery";
import { listService } from "@/services/list/list.service";

export const useCompanyStats = (listId: string) => {
  return useAppQuery({
    queryKey: [QueryKey.COMPANY_STATS, listId],
    queryFn: () => listService.getCompanyStats(listId),
  });
};
