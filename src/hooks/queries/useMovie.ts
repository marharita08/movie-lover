import { QueryKey } from "@/const";
import { useAppQuery } from "@/hooks/useAppQuery";
import { tmdbService } from "@/services/tmdb.service";
import type { MovieDetailsDto } from "@/types";

export const useMovie = (id?: string) => {
  return useAppQuery<MovieDetailsDto>({
    queryKey: [QueryKey.MOVIE, id],
    queryFn: async () => await tmdbService.getMovie(id!),
    enabled: !!id,
  });
};
