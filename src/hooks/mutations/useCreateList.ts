import { useNavigate } from "react-router-dom";

import { MutationKey, RouterKey } from "@/const";
import { listService } from "@/services/list.service";

import { useAppMutation } from "../useAppMutation";

export const useCreateList = () => {
  const navigate = useNavigate();

  return useAppMutation([MutationKey.CREATE_LIST], {
    mutationFn: listService.create,
    onSuccess: () => {
      navigate(RouterKey.LISTS);
    },
  });
};
