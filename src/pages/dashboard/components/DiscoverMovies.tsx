import { MediaList } from "@/components";
import { MediaType } from "@/const";
import { useDiscoverMovies } from "@/hooks";
import type { DiscoverMoviesQuery } from "@/types";

interface DiscoverMoviesProps {
  query: DiscoverMoviesQuery;
}

export const DiscoverMovies: React.FC<DiscoverMoviesProps> = ({ query }) => {
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
    />
  );
};
