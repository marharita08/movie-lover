import { QueryKey } from "@/const";
import { useAppQuery } from "@/hooks";
import { tmdbService } from "@/services/tmdb/tmdb.service";
import { useLanguageStore } from "@/store/language.store";

export const usePerson = (id: string) => {
  const language = useLanguageStore();

  return useAppQuery({
    queryKey: [QueryKey.PERSON, id, language],
    queryFn: () => tmdbService.getPerson(id, language),
  });
};
