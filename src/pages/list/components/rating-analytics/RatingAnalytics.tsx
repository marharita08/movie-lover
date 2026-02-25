import { useState } from "react";
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
import { MediaType } from "@/const";
import { useListGenres, useListYears, useRatingStats } from "@/hooks";

import { RatingBarChart } from "./RatingBarChart";

export const RatingAnalytics = () => {
  const { id } = useParams<{ id: string }>();

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

  const chartData = Object.entries(stats || {})
    .map(([key, value]) => ({
      rating: key,
      amount: value,
    }))
    .sort((a, b) => Number(a.rating) - Number(b.rating));

  return (
    <section className="flex w-fit flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Rating Distribution</h3>
      <div className="flex flex-wrap justify-center gap-4 px-2">
        <div className="w-full sm:w-48">
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger label="Genre">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
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
            <SelectTrigger label="Year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
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
            <SelectTrigger label="Media Type">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={MediaType.MOVIE}>Movie</SelectItem>
              <SelectItem value={MediaType.TV}>TV Show</SelectItem>
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
            title="Failed to load rating analytics"
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
