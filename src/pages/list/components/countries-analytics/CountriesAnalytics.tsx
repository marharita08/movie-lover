import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { EmptyState, ErrorState, Loading } from "@/components";
import { TranslationKey } from "@/const";
import { useCountryStats, useTranslation } from "@/hooks";

import { ListSection } from "../../const";
import { WorldMap } from "./WorldMap";

interface CountriesAnalyticsProps {
  onReady?: (section: ListSection) => void;
}

export const CountriesAnalytics: React.FC<CountriesAnalyticsProps> = ({
  onReady,
}) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = useCountryStats(id!);

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.COUNTRIES);
    }
  }, [isLoading, onReady]);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">
        {t(TranslationKey.LIST_COUNTRIES_TITLE)}
      </h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <ErrorState
          title={t(TranslationKey.LIST_COUNTRIES_LOAD_FAILED)}
          error={error}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && data && Object.keys(data).length > 0 && (
        <WorldMap data={data} />
      )}
      {!isLoading && !isError && (!data || Object.keys(data).length === 0) && (
        <EmptyState
          title={t(TranslationKey.LIST_COUNTRIES_EMPTY_TITLE)}
          description={t(TranslationKey.LIST_COUNTRIES_EMPTY_DESC)}
          icon={"film"}
        />
      )}
    </section>
  );
};
