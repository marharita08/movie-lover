import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { useYearsStats } from "@/hooks";

import { YearsBarChart } from "./YearsBarChart";

export const YearsAnalytics = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useYearsStats(id!);

  const chartData = Object.entries(stats || {}).map(([key, value]) => ({
    year: key,
    amount: value,
  }));

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Years Distribution</h3>
      {isLoading && (
        <div className="flex h-[400px] items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title="Failed to load years analytics"
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && chartData.length > 0 && (
        <YearsBarChart data={chartData} />
      )}
      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          title="No data found"
          description="No media found in your list"
        />
      )}
    </section>
  );
};
