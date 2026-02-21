import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "@/const";
import { listService } from "@/services";

export const useListYears = (listId: string) => {
  return useQuery({
    queryKey: [QueryKey.LIST_YEARS, listId],
    queryFn: () => listService.getYears(listId),
  });
};
