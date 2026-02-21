import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey } from "@/const";
import { listService } from "@/services";

import { useAppMutation } from "../useAppMutation";

export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.DELETE_LIST], {
    mutationFn: (id: string) => listService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.LISTS] });
    },
  });
};
