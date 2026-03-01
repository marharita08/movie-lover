import { QueryKey } from "@/const";
import { listService } from "@/services";
import type { GetMediaItemsQuery } from "@/types";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const useMediaItems = (listId: string, query: GetMediaItemsQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.MEDIA_ITEMS, listId, query],
    queryFn: ({ pageParam = 1 }) =>
      listService.getMediaItems(listId, { page: pageParam, ...query }),
  });
};
