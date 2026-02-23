import { QueryKey } from "@/const";
import { listService } from "@/services";
import type { GetPersonStatsQuery } from "@/types";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const usePersonStats = (listId: string, query: GetPersonStatsQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.PERSON_STATS, listId, query],
    queryFn: ({ pageParam = 1 }) =>
      listService.getPersonStats(listId, { ...query, page: pageParam }),
  });
};
