import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import type { MediaType } from "@/const";
import { useMediaTypeStats } from "@/hooks";

import { MediaTypePieChart } from "./MediaTypePieChart";

export const MediaTypeAnalytics = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: analitics,
    isLoading,
    isError,
    error,
    refetch,
  } = useMediaTypeStats(id!);

  const chartData = Object.entries(analitics || {}).map(([key, value]) => ({
    name: key as MediaType,
    value,
  }));

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Media types</h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title="Failed to load media types analitics"
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && chartData.length > 0 && (
        <MediaTypePieChart data={chartData} />
      )}
      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          title="No media types found"
          description="No media types found in your list"
        />
      )}
    </section>
  );
};
