import { useMemo } from "react";
import { generatePath, Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { RouterKey, TMDBImageUrl } from "@/const";
import type { PersonStatsItem } from "@/types";
import { getFallback } from "@/utils";

interface PersonProps {
  person: PersonStatsItem;
}

export const Person: React.FC<PersonProps> = ({ person }) => {
  const fallback = useMemo(() => getFallback(person.name), [person.name]);

  return (
    <Link to={generatePath(RouterKey.PERSON, { id: person.id })}>
      <div className="flex items-center gap-2">
        {
          <Avatar className="h-15 w-15">
            <AvatarImage src={`${TMDBImageUrl.W92}${person.profilePath}`} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        }
        <div>
          <p className="font-medium">{person.name}</p>
          <p className="text-muted-foreground text-xs">{person.titles}</p>
        </div>
      </div>
    </Link>
  );
};
