import { QueryKey } from "@/const";
import { tmdbService } from "@/services";
import type { MultiSearchQuery } from "@/types";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const useMultiSearch = (query: MultiSearchQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.MULTI_SEARCH, query],
    queryFn: ({ pageParam = 1 }) =>
      tmdbService.multiSearch({ ...query, page: pageParam }),
    enabled: !!query.query,
  });
};
