import { SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Input, MediaList } from "@/components";
import { StorageKey } from "@/const";
import { useMediaItems, useSearch } from "@/hooks";

import { ListSection } from "../../const";

interface MediasFromListProps {
  onReady?: (section: ListSection) => void;
}

export const MediasFromList: React.FC<MediasFromListProps> = ({ onReady }) => {
  const { id } = useParams<{ id: string }>();
  const { search, setSearch, debouncedSearch } = useSearch();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useMediaItems(id!, { search: debouncedSearch });

  const items = data?.pages.flatMap((page) => page.results) ?? [];

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.MEDIAS);
    }
  }, [isLoading, onReady]);

  return (
    <section className="flex flex-col gap-4">
      <div className="mb-4 flex items-center gap-8 py-1">
        <h2 className="px-2 text-2xl font-bold md:px-0">List</h2>
        <search className="w-full max-w-md flex-1">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon className="h-4 w-4" />}
            maxLength={255}
            onClear={() => setSearch("")}
          />
        </search>
      </div>
      <MediaList
        medias={items}
        isLoading={isLoading}
        isError={isError}
        error={error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        storageKey={`${StorageKey.LIST_MEDIA_ITEMS}_${id}`}
      />
    </section>
  );
};
