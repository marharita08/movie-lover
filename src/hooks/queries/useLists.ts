import { useInfiniteQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { listService } from "@/services/list.service";
import type { GetListsQuery } from "@/types/get-lists-query.type";

export const useLists = (query: GetListsQuery) => {
  return useInfiniteQuery({
    queryKey: [QueryKey.LISTS, query],
    queryFn: ({ pageParam = 1 }) =>
      listService.getAll({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
