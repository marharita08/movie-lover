import { QueryKey } from "@/const";
import { fileService } from "@/services/file.service";

import { useAppQuery } from "../useAppQuery";

export const useFileData = (id?: string | null) => {
  return useAppQuery({
    queryKey: [QueryKey.FILE, id],
    queryFn: () => fileService.getById(id!),
    enabled: !!id,
  });
};
