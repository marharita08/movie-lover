import { QueryKey } from "@/const";
import { tmdbService } from "@/services";
import type { TVShowResponse } from "@/types";

import { useAppQuery } from "../../use-app-query/useAppQuery";

export const useTVShow = (id?: string) => {
  return useAppQuery<TVShowResponse>({
    queryKey: [QueryKey.TV_SHOW, id],
    queryFn: () => tmdbService.getTVShow(id!),
    enabled: !!id,
  });
};
