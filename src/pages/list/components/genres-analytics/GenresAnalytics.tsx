import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { TranslationKey } from "@/const";
import { useGenreStats, useTranslation } from "@/hooks";

import { ListSection } from "../../const";
import { GenresBarChart } from "./GenresBarChart";

interface GenresAnalyticsProps {
  onReady?: (section: ListSection) => void;
}

export const GenresAnalytics: React.FC<GenresAnalyticsProps> = ({
  onReady,
}) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    data: analitics,
    isLoading,
    isError,
    error,
    refetch,
  } = useGenreStats(id!);

  const genres = Object.entries(analitics || {}).map(([key, value]) => ({
    genre: key,
    amount: value,
  }));

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.GENRES);
    }
  }, [isLoading, onReady]);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">
        {t(TranslationKey.LIST_GENRES_TITLE)}
      </h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title={t(TranslationKey.LIST_GENRES_LOAD_FAILED)}
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && genres.length > 0 && (
        <GenresBarChart data={genres} />
      )}
      {!isLoading && !isError && genres.length === 0 && (
        <EmptyState
          title={t(TranslationKey.LIST_GENRES_EMPTY_TITLE)}
          description={t(TranslationKey.LIST_GENRES_EMPTY_DESC)}
          icon={"film"}
        />
      )}
    </section>
  );
};
