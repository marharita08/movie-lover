import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { MediaList, Separator } from "@/components";
import { StorageKey } from "@/const";
import { useUpcomingTVShows } from "@/hooks";

import { ListSection } from "../../const";

interface UpcomingTVShowsProps {
  onReady?: (section: ListSection) => void;
}

export const UpcomingTVShows: React.FC<UpcomingTVShowsProps> = ({
  onReady,
}) => {
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

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.UPCOMING_TV_SHOWS);
    }
  }, [isLoading, onReady]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Separator />
      <section className="flex flex-col gap-4">
        <h2 className="px-2 text-xl font-bold md:px-0">
          TV shows with upcoming episodes
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
          storageKey={`${StorageKey.UPCOMING_TV_SHOWS}_${id}`}
        />
      </section>
    </>
  );
};
