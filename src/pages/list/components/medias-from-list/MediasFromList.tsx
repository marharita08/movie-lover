import { useParams } from "react-router-dom";

import { MediaList } from "@/components";
import { useMediaItems } from "@/hooks";

export const MediasFromList = () => {
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
  } = useMediaItems(id!);

  const items = data?.pages.flatMap((page) => page.results) ?? [];

  return (
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
  );
};
