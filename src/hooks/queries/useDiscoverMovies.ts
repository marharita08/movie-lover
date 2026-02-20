import { QueryKey } from "@/const";
import { tmdbService } from "@/services/tmdb.service";
import type { DiscoverMoviesQuery } from "@/types";

import { useAppInfiniteQuery } from "../useAppInfiniteQuery";

export const useDiscoverMovies = (query: DiscoverMoviesQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.DISCOVER_MOVIES, query],
    queryFn: ({ pageParam = 1 }) =>
      tmdbService.getDiscoverMovies({ ...query, page: pageParam }),
  });
};
