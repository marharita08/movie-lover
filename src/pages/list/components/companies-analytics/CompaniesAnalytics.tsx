import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { useCompanyStats } from "@/hooks";

import { CompaniesBarChart } from "./CompaniesBarChart";

export const CompaniesAnalytics = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: analitics,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompanyStats(id!);

  const companies = Object.entries(analitics || {}).map(([key, value]) => ({
    company: key,
    amount: value,
  }));

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Production companies</h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title="Failed to load production companies analitics"
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && companies.length > 0 && (
        <CompaniesBarChart data={companies} />
      )}
      {!isLoading && !isError && companies.length === 0 && (
        <EmptyState
          title="No production companies found"
          description="No production companies found in your list"
        />
      )}
    </section>
  );
};
