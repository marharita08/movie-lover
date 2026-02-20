import { QueryKey } from "@/const";
import { listService } from "@/services/list.service";
import type { GetPersonStatsQuery } from "@/types/get-person-stats-query.type";

import { useAppInfiniteQuery } from "../useAppInfiniteQuery";

export const usePersonStats = (listId: string, query: GetPersonStatsQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.PERSON_STATS, listId, query.role, query.limit],
    queryFn: ({ pageParam = 1 }) =>
      listService.getPersonStats(listId, { ...query, page: pageParam }),
  });
};
