import { QueryKey } from "@/const";
import { tmdbService } from "@/services";
import { useLanguageStore } from "@/store/language.store";
import type { MultiSearchQuery } from "@/types";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const useMultiSearch = (query: MultiSearchQuery) => {
  const { language } = useLanguageStore();

  return useAppInfiniteQuery({
    queryKey: [QueryKey.MULTI_SEARCH, query, language],
    queryFn: ({ pageParam = 1 }) =>
      tmdbService.multiSearch({ ...query, page: pageParam, language }),
    enabled: !!query.query,
  });
};
