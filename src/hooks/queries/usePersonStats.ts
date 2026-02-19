import { QueryKey } from "@/const";
import type { PersonRole } from "@/const/person-role";
import { listService } from "@/services/list.service";

import { useAppQuery } from "../useAppQuery";

export const usePersonStats = (listId: string, role: PersonRole) => {
  return useAppQuery({
    queryKey: [QueryKey.PERSON_STATS, listId, role],
    queryFn: () => listService.getPersonStats(listId, role),
  });
};
