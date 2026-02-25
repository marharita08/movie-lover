import { QueryKey } from "@/const";
import { listService } from "@/services";

import { useAppInfiniteQuery } from "../../use-app-infinite-query/useAppInfiniteQuery";

export const useMediaItems = (listId: string) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.MEDIA_ITEMS, listId],
    queryFn: ({ pageParam = 1 }) =>
      listService.getMediaItems(listId, { page: pageParam }),
  });
};
