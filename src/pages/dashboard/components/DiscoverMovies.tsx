import { useEffect } from "react";

import { MediaList } from "@/components";
import { MediaType, StorageKey } from "@/const";
import { useDiscoverMovies } from "@/hooks";
import type { DiscoverMoviesQuery } from "@/types";

interface DiscoverMoviesProps {
  query: DiscoverMoviesQuery;
  onReady: (section: number) => void;
}

export const DiscoverMovies: React.FC<DiscoverMoviesProps> = ({
  query,
  onReady,
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useDiscoverMovies(query);

  const movies =
    data?.pages
      .flatMap((page) => page.results)
      .map((movie) => ({ ...movie, type: MediaType.MOVIE })) ?? [];

  useEffect(() => {
    if (!isLoading) {
      onReady(query.primaryReleaseYear!);
    }
  }, [isLoading, onReady, query.primaryReleaseYear]);

  return (
    <MediaList
      medias={movies}
      isLoading={isLoading}
      isError={isError}
      error={error}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      refetch={refetch}
      storageKey={`${StorageKey.DISCOVER_MOVIES}_${query.primaryReleaseYear}`}
    />
  );
};
