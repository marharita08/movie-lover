import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { toast } from "@/hooks";
import { HttpException } from "@/types/exception.type";

type AppQueryProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  defaultErrorHandling?: boolean;
  onError?: (error: TError) => void;
} & UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;

export const useAppQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  onError,
  defaultErrorHandling = true,
  ...params
}: AppQueryProps<TQueryFnData, TError, TData, TQueryKey>) => {
  const response = useQuery({
    ...params,
  });

  useEffect(() => {
    if (response.isError) {
      if (!defaultErrorHandling || !(response.error instanceof HttpException)) {
        return onError?.(response.error);
      }

      onError?.(response.error);
      toast({
        title: response.error?.body?.message,
        variant: "destructive",
      });

      return;
    }
  }, [onError, response.isError, response.error, defaultErrorHandling]);

  return response;
};
