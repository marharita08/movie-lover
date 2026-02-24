import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { useGenreStats } from "@/hooks";

import { GenresBarChart } from "./GenresBarChart";

export const GenresAnalytics = () => {
  const { id } = useParams<{ id: string }>();

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

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Genres</h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title="Failed to load genres analitics"
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && genres.length > 0 && (
        <GenresBarChart data={genres} />
      )}
      {!isLoading && !isError && genres.length === 0 && (
        <EmptyState
          title="No genres found"
          description="No genres found in your list"
        />
      )}
    </section>
  );
};
