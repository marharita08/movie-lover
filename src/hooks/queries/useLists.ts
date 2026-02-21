import { QueryKey } from "@/const";
import { listService } from "@/services";
import type { GetListsQuery } from "@/types";

import { useAppInfiniteQuery } from "../useAppInfiniteQuery";

export const useLists = (query: GetListsQuery) => {
  return useAppInfiniteQuery({
    queryKey: [QueryKey.LISTS, query],
    queryFn: ({ pageParam = 1 }) =>
      listService.getAll({ ...query, page: pageParam }),
  });
};
