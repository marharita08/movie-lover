import { SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { EmptyState, ErrorState, Input, Loading } from "@/components";
import { useMultiSearch, useSearch } from "@/hooks";

import { SearchResultCard } from "./components/SearchResultCard";

export const Search = () => {
  const { search, setSearch, debouncedSearch } = useSearch();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useMultiSearch({ query: debouncedSearch });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const results = data?.pages.flatMap((page) => page.results) ?? [];

  const isEmpty = results.length === 0 && !isLoading && !isError;

  return (
    <search className="px-4 md:px-0">
      <h2 className="text-xl font-bold">Search</h2>
      <div className="mt-4 max-w-md">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<SearchIcon className="h-4 w-4" />}
          maxLength={255}
        />
      </div>
      {isError && (
        <ErrorState
          title="Failed to load your search results"
          description="We couldn't fetch your search results. Please try again."
          error={error}
          onRetry={() => refetch()}
          type="server"
        />
      )}
      {!isEmpty && (
        <div className="grid grid-cols-1 gap-x-4 px-0 py-4 md:grid-cols-2 md:px-4">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
          <div ref={ref} className="h-10" />
        </div>
      )}
      {isEmpty && (
        <EmptyState
          title={
            debouncedSearch
              ? "No matching results found"
              : "Search for movies, TV shows, or people"
          }
          description={
            debouncedSearch
              ? `We couldn't find any results matching "${debouncedSearch}". Try a different name.`
              : "Start typing to search..."
          }
          icon={"film"}
        />
      )}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex justify-center pt-16">
          <Loading />
        </div>
      )}
    </search>
  );
};
