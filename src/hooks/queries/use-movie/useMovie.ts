import { QueryKey } from "@/const";
import { useAppQuery } from "@/hooks";
import { tmdbService } from "@/services";
import { useLanguageStore } from "@/store/language.store";
import type { MovieDetailsDto } from "@/types";

export const useMovie = (id?: string) => {
  const { language } = useLanguageStore();

  return useAppQuery<MovieDetailsDto>({
    queryKey: [QueryKey.MOVIE, id, language],
    queryFn: async () => await tmdbService.getMovie(id!, { language }),
    enabled: !!id,
  });
};
