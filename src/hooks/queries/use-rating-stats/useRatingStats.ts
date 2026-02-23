import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { listService } from "@/services";
import type { GetRatingStatsQuery } from "@/types";

export const useRatingStats = (listId: string, query: GetRatingStatsQuery) => {
  return useQuery({
    queryKey: [QueryKey.RATING_STATS, listId, query],
    queryFn: () => listService.getRatingStats(listId, query),
  });
};
