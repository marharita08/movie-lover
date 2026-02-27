import { QueryKey } from "@/const";
import { useAppQuery } from "@/hooks";
import { tmdbService } from "@/services/tmdb/tmdb.service";

export const usePerson = (id: string) => {
  return useAppQuery({
    queryKey: [QueryKey.PERSON, id],
    queryFn: () => tmdbService.getPerson(id),
  });
};
