import { MutationKey } from "@/const";
import { fileService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";

export const useDeleteFile = () => {
  return useAppMutation([MutationKey.DELETE_FILE], {
    mutationFn: (id: string) => fileService.delete(id),
  });
};
