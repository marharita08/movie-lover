import { QueryKey } from "@/const";
import { analiticsService } from "@/services/analitycs.service";

import { useAppQuery } from "../useAppQuery";

export const useAnalitics = (listId: string) => {
  return useAppQuery({
    queryKey: [QueryKey.ANALYTICS, listId],
    queryFn: () => analiticsService.analize(listId),
  });
};
