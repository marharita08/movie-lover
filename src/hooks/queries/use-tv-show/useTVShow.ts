import { QueryKey } from "@/const";
import { tmdbService } from "@/services";
import { useLanguageStore } from "@/store/language.store";
import type { TVShowResponse } from "@/types";

import { useAppQuery } from "../../use-app-query/useAppQuery";

export const useTVShow = (id?: string) => {
  const { language } = useLanguageStore();

  return useAppQuery<TVShowResponse>({
    queryKey: [QueryKey.TV_SHOW, id, language],
    queryFn: () => tmdbService.getTVShow(id!, { language }),
    enabled: !!id,
  });
};
