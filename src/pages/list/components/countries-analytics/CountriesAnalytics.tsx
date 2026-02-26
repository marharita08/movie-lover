import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { useCountryStats } from "@/hooks";

import { WorldMap } from "./WorldMap";

export const CountriesAnalytics = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error, refetch } = useCountryStats(id!);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Production countries</h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title="Failed to load production countries analitics"
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && data && Object.keys(data).length > 0 && (
        <WorldMap data={data} />
      )}
      {!isLoading && !isError && (!data || Object.keys(data).length === 0) && (
        <EmptyState
          title="No production countries found"
          description="No production countries found in your list"
        />
      )}
    </section>
  );
};
