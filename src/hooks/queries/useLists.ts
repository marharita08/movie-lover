import { QueryKey } from "@/const";
import { listService } from "@/services/list.service";
import type { GetListsQuery } from "@/types/get-lists-query.type";

import { useAppInfiniteQuery } from "../useAppInfiniteQuery";

export const useLists = (query: GetListsQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.LISTS, query],
    queryFn: ({ pageParam = 1 }) =>
      listService.getAll({ ...query, page: pageParam }),
  });
};
