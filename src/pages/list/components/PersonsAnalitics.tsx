import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { PersonRole, personRoleMap } from "@/const/person-role";
import { usePersonStats } from "@/hooks";

import { Person } from "./Person";

interface PersonsAnaliticsProps {
  role: PersonRole;
}

export const PersonsAnalitics: React.FC<PersonsAnaliticsProps> = ({ role }) => {
  const { id } = useParams<{ id: string }>();

  const {
    data: analitics,
    isLoading,
    isError,
    refetch,
  } = usePersonStats(id!, role);

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
          description="Please try again later"
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && analitics?.persons.length === 0 && (
        <EmptyState
          title={`No ${personRoleMap[role]} found`}
          description={`No ${personRoleMap[role]} found in your list`}
        />
      )}
      <div className="grid grid-cols-1 gap-4 px-0 pb-4 md:grid-cols-2 md:px-4">
        {analitics?.persons.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};
