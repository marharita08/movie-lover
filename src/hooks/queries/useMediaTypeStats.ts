import { QueryKey } from "@/const";
import { listService } from "@/services";

import { useAppQuery } from "../useAppQuery";

export const useMediaTypeStats = (listId: string) => {
  return useAppQuery({
    queryKey: [QueryKey.MEDIA_TYPE_STATS, listId],
    queryFn: () => listService.getMediaTypeStats(listId),
  });
};
