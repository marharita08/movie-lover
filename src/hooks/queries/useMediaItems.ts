import { QueryKey } from "@/const";
import { listService } from "@/services/list.service";

import { useAppInfiniteQuery } from "../useAppInfiniteQuery";

export const useMediaItems = (listId: string) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.MEDIA_ITEMS, listId],
    queryFn: ({ pageParam = 1 }) =>
      listService.getMediaItems(listId, { page: pageParam }),
  });
};
