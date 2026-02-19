import { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { ImdbUrl } from "@/const/imdb-url";
import type { PersonStatsItem } from "@/types/person-stats.type";
import { getFallback } from "@/utils/get-fallback";

interface PersonProps {
  person: PersonStatsItem;
}

const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export const Person: React.FC<PersonProps> = ({ person }) => {
  const fallback = useMemo(() => getFallback(person.name), [person.name]);

  return (
    <div key={person.id} className="flex items-center gap-2">
      {
        <Avatar className="h-15 w-15">
          <AvatarImage src={`${imageBaseUrl}${person.profilePath}`} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      }
      <div>
        {person.imdbId ? (
          <a
            href={`${ImdbUrl.PERSON}${person.imdbId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="font-medium hover:underline">{person.name}</p>
          </a>
        ) : (
          <p className="font-medium">{person.name}</p>
        )}
        <p className="text-muted-foreground text-sm">{person.titles}</p>
      </div>
    </div>
  );
};
