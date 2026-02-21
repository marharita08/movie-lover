import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { listService } from "@/services";

export const useListGenres = (listId: string) => {
  return useQuery({
    queryKey: [QueryKey.LIST_GENRES, listId],
    queryFn: () => listService.getGenres(listId),
  });
};
