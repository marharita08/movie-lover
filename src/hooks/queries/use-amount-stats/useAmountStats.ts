import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { listService } from "@/services";

export const useAmountStats = (listId: string) => {
  return useQuery({
    queryKey: [QueryKey.AMOUNT_STATS, listId],
    queryFn: () => listService.getAmountStats(listId),
  });
};
