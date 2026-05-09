import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { type MediaType, TranslationKey } from "@/const";
import { useMediaTypeStats, useTranslation } from "@/hooks";

import { ListSection } from "../../const";
import { MediaTypePieChart } from "./MediaTypePieChart";

interface MediaTypeAnalyticsProps {
  onReady?: (section: ListSection) => void;
}

export const MediaTypeAnalytics: React.FC<MediaTypeAnalyticsProps> = ({
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
  } = useMediaTypeStats(id!);

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.MEDIA_TYPE);
    }
  }, [isLoading, onReady]);

  const chartData = Object.entries(analitics || {}).map(([key, value]) => ({
    name: key as MediaType,
    value,
  }));

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">
        {t(TranslationKey.LIST_MEDIA_TYPES_TITLE)}
      </h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title={t(TranslationKey.LIST_MEDIA_TYPES_LOAD_FAILED)}
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && chartData.length > 0 && (
        <MediaTypePieChart data={chartData} />
      )}
      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          title={t(TranslationKey.LIST_MEDIA_TYPES_EMPTY_TITLE)}
          description={t(TranslationKey.LIST_MEDIA_TYPES_EMPTY_DESC)}
          icon={"film"}
        />
      )}
    </section>
  );
};
