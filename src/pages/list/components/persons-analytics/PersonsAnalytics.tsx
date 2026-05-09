import { useEffect } from "react";
import { generatePath, Link, useParams } from "react-router-dom";

import { Button, EmptyState, ErrorState, Loading, Person } from "@/components";
import { PersonRole, personRoleMap, RouterKey, TranslationKey } from "@/const";
import { usePersonStats, useTranslation } from "@/hooks";

import { ListSection } from "../../const";

interface PersonsAnalyticsProps {
  role: PersonRole;
  onReady?: (section: ListSection) => void;
}

export const PersonsAnalytics: React.FC<PersonsAnalyticsProps> = ({
  role,
  onReady,
}) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = usePersonStats(id!, {
    role,
    limit: 10,
  });

  const analitics = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    if (!isLoading) {
      onReady?.(
        role === PersonRole.ACTOR
          ? ListSection.PERSONS_ACTORS
          : ListSection.PERSONS_DIRECTORS,
      );
    }
  }, [isLoading, onReady, role]);

  return (
    <div className="flex flex-col gap-4 px-2">
      <h3 className="text-lg font-bold">{t(personRoleMap[role])}</h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title={t(TranslationKey.LIST_PERSONS_LOAD_FAILED)}
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && analitics?.length === 0 && (
        <EmptyState
          title={t(TranslationKey.LIST_PERSONS_EMPTY_TITLE).replace(
            "{{role}}",
            t(personRoleMap[role]),
          )}
          description={t(TranslationKey.LIST_PERSONS_EMPTY_DESC).replace(
            "{{role}}",
            t(personRoleMap[role]),
          )}
          icon={"film"}
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
                to={generatePath(RouterKey.PERSONS_ANALYTICS, {
                  id: id!,
                  role,
                })}
              >
                {t(TranslationKey.COMMON_VIEW_ALL)}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
