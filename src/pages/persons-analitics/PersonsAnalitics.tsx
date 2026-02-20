import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate, useParams } from "react-router-dom";

import { Button, EmptyState, ErrorState, Loading } from "@/components";
import { PersonRole, personRoleMap } from "@/const/person-role";
import { usePersonStats } from "@/hooks";

import { Person } from "../list/components/Person";

export const PersonsAnalitics = () => {
  const { id, role } = useParams<{ id: string; role: PersonRole }>();

  const roleParsed = role as PersonRole;
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePersonStats(id!, {
    role: roleParsed,
    limit: 20,
  });

  const analitics = data?.pages.flatMap((page) => page.results) || [];

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="bg-background fixed z-50 flex w-full items-center gap-2 rounded-md px-2 py-1">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{personRoleMap[roleParsed]}</h1>
      </div>
      <div className="pt-15">
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
            title={`No ${personRoleMap[roleParsed]} found`}
            description={`No ${personRoleMap[roleParsed]} found in your list`}
          />
        )}
        {analitics.length > 0 && (
          <div className="grid grid-cols-1 gap-4 px-0 pb-4 md:grid-cols-2 md:px-4">
            {analitics?.map((person) => (
              <Person key={person.id} person={person} />
            ))}
            <div ref={ref} className="h-10" />
          </div>
        )}
      </div>
    </div>
  );
};
