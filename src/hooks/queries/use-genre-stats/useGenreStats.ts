import { QueryKey } from "@/const";
import { listService } from "@/services";

import { useAppQuery } from "../../use-app-query/useAppQuery";

export const useGenreStats = (listId: string) => {
  return useAppQuery({
    queryKey: [QueryKey.GENRE_STATS, listId],
    queryFn: () => listService.getGenreStats(listId),
  });
};
