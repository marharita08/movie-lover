import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { TranslationKey } from "@/const";
import { useTranslation, useYearsStats } from "@/hooks";

import { ListSection } from "../../const";
import { YearsBarChart } from "./YearsBarChart";

interface YearsAnalyticsProps {
  onReady?: (section: ListSection) => void;
}

export const YearsAnalytics: React.FC<YearsAnalyticsProps> = ({ onReady }) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useYearsStats(id!);

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.YEARS);
    }
  }, [isLoading, onReady]);

  const chartData = Object.entries(stats || {}).map(([key, value]) => ({
    year: key,
    amount: value,
  }));

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">
        {t(TranslationKey.LIST_YEARS_TITLE)}
      </h3>
      {isLoading && (
        <div className="flex h-[400px] items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title={t(TranslationKey.LIST_YEARS_LOAD_FAILED)}
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && chartData.length > 0 && (
        <YearsBarChart data={chartData} />
      )}
      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          title={t(TranslationKey.COMMON_DATA_NOT_FOUND)}
          description={t(TranslationKey.COMMON_NO_MEDIA_FOUND)}
          icon={"film"}
        />
      )}
    </section>
  );
};
