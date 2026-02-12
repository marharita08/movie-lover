import { useInfiniteQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { tmdbService } from "@/services/tmdb.service";
import type { DiscoverMoviesQuery } from "@/types";

export const useDiscoverMovies = (query: DiscoverMoviesQuery) => {
  return useInfiniteQuery({
    queryKey: [QueryKey.DISCOVER_MOVIES, query],
    queryFn: ({ pageParam = 1 }) =>
      tmdbService.getDiscoverMovies({ ...query, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
