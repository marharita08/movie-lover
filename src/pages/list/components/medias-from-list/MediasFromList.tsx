import { SearchIcon } from "lucide-react";
import { useParams } from "react-router-dom";

import { Input, MediaList } from "@/components";
import { useMediaItems, useSearch } from "@/hooks";

export const MediasFromList = () => {
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

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="mb-4 px-2 text-2xl font-bold md:px-0">List</h2>
        <search>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon className="h-4 w-4" />}
            maxLength={255}
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
      />
    </section>
  );
};
