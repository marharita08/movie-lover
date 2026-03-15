import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey } from "@/const";
import { listService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.CREATE_LIST], {
    mutationFn: listService.create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QueryKey.LISTS],
      });
    },
  });
};
