import { generatePath, Link, useParams } from "react-router-dom";

import { Button, EmptyState, ErrorState, Loading } from "@/components";
import { RouterKey } from "@/const";
import { PersonRole, personRoleMap } from "@/const/person-role";
import { usePersonStats } from "@/hooks";

import { Person } from "./Person";

interface PersonsAnaliticsProps {
  role: PersonRole;
}

export const PersonsAnalitics: React.FC<PersonsAnaliticsProps> = ({ role }) => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error, refetch } = usePersonStats(id!, {
    role,
    limit: 10,
  });

  const analitics = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="flex flex-col gap-4 px-2">
      <h3 className="text-lg font-bold">{personRoleMap[role]}</h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title="Failed to load persons analitics"
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && analitics?.length === 0 && (
        <EmptyState
          title={`No ${personRoleMap[role]} found`}
          description={`No ${personRoleMap[role]} found in your list`}
        />
      )}
      {analitics.length > 0 && (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 gap-4 px-0 pb-4 md:grid-cols-2 md:px-4">
            {analitics.map((person) => (
              <Person key={person.id} person={person} />
            ))}
          </div>
          <div>
            <Button asChild variant={"link"}>
              <Link
                to={generatePath(RouterKey.PERSONS_ANALITICS, {
                  id: id || null,
                  role,
                })}
              >
                View all
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
