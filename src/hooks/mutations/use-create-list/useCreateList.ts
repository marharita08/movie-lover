import { useQueryClient } from "@tanstack/react-query";
import { generatePath, useNavigate } from "react-router-dom";

import { MutationKey, QueryKey, RouterKey } from "@/const";
import { listService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useCreateList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.CREATE_LIST], {
    mutationFn: listService.create,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [QueryKey.LISTS],
      });
      navigate(generatePath(RouterKey.LIST, { id: data.id }));
    },
  });
};
