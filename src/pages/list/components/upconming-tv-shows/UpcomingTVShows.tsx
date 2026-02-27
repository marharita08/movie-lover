import { useParams } from "react-router-dom";

import { MediaList } from "@/components";
import { useUpcomingTVShows } from "@/hooks/queries/use-upcoming-tv-shows/useUpcomingTVShows";

export const UpcomingTVShows = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useUpcomingTVShows(id!);

  const items = data?.pages.flatMap((page) => page.results) ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-2 text-xl font-bold md:px-0">
        TV shows with upcoming episodes from this list
      </h2>
      <MediaList
        medias={items}
        isLoading={isLoading}
        isError={isError}
        error={error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
      />
    </section>
  );
};
