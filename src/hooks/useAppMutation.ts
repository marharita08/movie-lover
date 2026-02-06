import {
  type MutationKey,
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { toast } from "@/hooks/useToast";
import { HttpException } from "@/types/exception.type";

type AppMutationProps<
  TData = unknown,
  TError = HttpException,
  TVariables = void,
  TContext = unknown,
> = {
  defaultErrorHandling?: boolean;
} & Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  "mutationKey"
>;

export const useAppMutation = <
  TData = unknown,
  TError = HttpException,
  TVariables = void,
  TContext = unknown,
>(
  mutationKey: MutationKey = [],
  {
    defaultErrorHandling = true,
    ...params
  }: AppMutationProps<TData, TError, TVariables, TContext>,
) =>
  useMutation({
    mutationKey,
    ...params,
    onError: (error, variables, context, mutation) => {
      if (defaultErrorHandling && error instanceof HttpException) {
        const { body } = error;
        toast({
          title: `${body?.message}`,
          variant: "destructive",
        });
      }

      params.onError?.(error, variables, context, mutation);
    },
  });
