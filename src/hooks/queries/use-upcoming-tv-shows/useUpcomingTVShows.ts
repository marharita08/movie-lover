import { QueryKey } from "@/const";
import { listService } from "@/services";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const useUpcomingTVShows = (listId: string) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.UPCOMING_TV_SHOWS, listId],
    queryFn: ({ pageParam = 1 }) =>
      listService.getUpcomingTVShows(listId, { page: pageParam }),
  });
};
