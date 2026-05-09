import { QueryKey } from "@/const";
import { tmdbService } from "@/services";
import { useLanguageStore } from "@/store/language.store";
import type { DiscoverMoviesQuery } from "@/types";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const useDiscoverMovies = (query: DiscoverMoviesQuery) => {
  const { language } = useLanguageStore();

  return useAppInfiniteQuery({
    queryKey: [QueryKey.DISCOVER_MOVIES, query, language],
    queryFn: ({ pageParam = 1 }) =>
      tmdbService.getDiscoverMovies({ ...query, page: pageParam, language }),
  });
};
