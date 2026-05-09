import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ErrorState,
  Loading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { MediaType, TranslationKey } from "@/const";
import {
  useListGenres,
  useListYears,
  useRatingStats,
  useTranslation,
} from "@/hooks";

import { ListSection } from "../../const";
import { RatingBarChart } from "./RatingBarChart";

interface RatingAnalyticsProps {
  onReady?: (section: ListSection) => void;
}

export const RatingAnalytics: React.FC<RatingAnalyticsProps> = ({
  onReady,
}) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [genre, setGenre] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [mediaType, setMediaType] = useState<MediaType | "all">("all");

  const { data: genresData } = useListGenres(id!);
  const { data: yearsData } = useListYears(id!);

  const query = {
    genre: genre === "all" ? undefined : genre,
    year: year === "all" ? undefined : Number(year),
    type: mediaType === "all" ? undefined : mediaType,
  };

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useRatingStats(id!, query);

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.RATING);
    }
  }, [isLoading, onReady]);

  const chartData = Object.entries(stats || {})
    .map(([key, value]) => ({
      rating: key,
      amount: value,
    }))
    .sort((a, b) => Number(a.rating) - Number(b.rating));

  return (
    <section className="flex w-fit flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">
        {t(TranslationKey.LIST_RATING_TITLE)}
      </h3>
      <div className="flex flex-wrap justify-center gap-4 px-2">
        <div className="w-full sm:w-48">
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger label={t(TranslationKey.COMMON_GENRE)}>
              <SelectValue
                placeholder={t(TranslationKey.COMMON_SELECT_GENRE)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t(TranslationKey.COMMON_ALL_GENRES)}
              </SelectItem>
              {genresData?.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-32">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger label={t(TranslationKey.COMMON_YEAR)}>
              <SelectValue placeholder={t(TranslationKey.COMMON_SELECT_YEAR)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t(TranslationKey.COMMON_ALL_YEARS)}
              </SelectItem>
              {yearsData
                ?.sort((a, b) => b - a)
                .map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-40">
          <Select
            value={mediaType}
            onValueChange={(value) => setMediaType(value as MediaType | "all")}
          >
            <SelectTrigger label={t(TranslationKey.COMMON_MEDIA_TYPE)}>
              <SelectValue
                placeholder={t(TranslationKey.COMMON_SELECT_MEDIA_TYPE)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t(TranslationKey.COMMON_ALL_TYPES)}
              </SelectItem>
              <SelectItem value={MediaType.MOVIE}>
                {t(TranslationKey.COMMON_MOVIE)}
              </SelectItem>
              <SelectItem value={MediaType.TV}>
                {t(TranslationKey.COMMON_TV_SHOW)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="flex h-[400px] items-center justify-center">
            <Loading />
          </div>
        )}
        {isError && (
          <ErrorState
            title={t(TranslationKey.LIST_RATING_LOAD_FAILED)}
            error={error}
            onRetry={refetch}
          />
        )}
        {!isLoading && !isError && chartData.length > 0 && (
          <RatingBarChart data={chartData} />
        )}
      </div>
    </section>
  );
};
