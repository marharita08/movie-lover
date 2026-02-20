import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

import type { PaginatedResponse } from "@/types";

type AppInfiniteQueryOptions<
  TData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseInfiniteQueryOptions<
    PaginatedResponse<TData>,
    Error,
    InfiniteData<PaginatedResponse<TData>>,
    TQueryKey,
    number
  >,
  "getNextPageParam" | "initialPageParam"
>;

export const useAppInfiniteQuery = <
  TData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: AppInfiniteQueryOptions<TData, TQueryKey>,
) => {
  return useInfiniteQuery<
    PaginatedResponse<TData>,
    Error,
    InfiniteData<PaginatedResponse<TData>>,
    TQueryKey,
    number
  >({
    ...options,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
