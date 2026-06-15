import { useVirtualizer } from "@tanstack/react-virtual";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { EmptyState, ErrorState, Input, Loading } from "@/components";
import { TranslationKey } from "@/const";
import {
  useIsMobile,
  useMultiSearch,
  useSearch,
  useTranslation,
  useVirtualScrollRestoration,
} from "@/hooks";
import type { MultiSearchResponseItem } from "@/types";

import { SearchResultCard } from "./components/SearchResultCard";

export const Search = () => {
  const { t } = useTranslation();
  const { search, setSearch, debouncedSearch } = useSearch();
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

  const results = data?.pages.flatMap((page) => page.results) ?? [];

  const columnsCount = isMobile ? 1 : 2;
  const rows: MultiSearchResponseItem[][] = [];
  for (let i = 0; i < results.length; i += columnsCount) {
    rows.push(results.slice(i, i + columnsCount));
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 137,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useVirtualScrollRestoration(rowVirtualizer, parentRef, !isLoading);

  useEffect(() => {
    if (virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    const isNearEnd = lastItem.index >= rows.length - 3;

    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    virtualItems.length,
    virtualItems,
    rows.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const isEmpty = results.length === 0 && !isLoading && !isError;

  return (
    <div className="flex h-[calc(100vh-88px)] flex-col overflow-hidden px-4 md:px-0">
      <div className="shrink-0">
        <h2 className="text-xl font-bold">{t(TranslationKey.SEARCH_TITLE)}</h2>
        <div className="my-4 max-w-md">
          <Input
            placeholder={t(TranslationKey.SEARCH_PLACEHOLDER)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon className="h-4 w-4" />}
            maxLength={255}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {isError && (
        <div className="flex-1 overflow-auto pt-4">
          <ErrorState
            title={t(TranslationKey.SEARCH_LOAD_FAILED_TITLE)}
            description={t(TranslationKey.SEARCH_LOAD_FAILED_DESC)}
            error={error}
            onRetry={() => refetch()}
            type="server"
          />
        </div>
      )}

      {isEmpty && (
        <div className="flex-1 overflow-auto pt-4">
          <EmptyState
            title={
              debouncedSearch
                ? t(TranslationKey.SEARCH_EMPTY_MATCH_TITLE)
                : t(TranslationKey.SEARCH_EMPTY_TITLE)
            }
            description={
              debouncedSearch
                ? t(TranslationKey.SEARCH_EMPTY_MATCH_DESC).replace(
                    "{{search}}",
                    debouncedSearch,
                  )
                : t(TranslationKey.SEARCH_EMPTY_DESC)
            }
            icon={"film"}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Loading />
        </div>
      )}

      {!isEmpty && !isLoading && (
        <div ref={parentRef} className="flex-1 overflow-auto pt-4">
          <div
            className="relative w-full"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  className="absolute top-0 left-0 w-full"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <div className="grid grid-cols-1 gap-x-4 px-0 pb-4 md:grid-cols-2 md:px-4">
                    {row.map((result) => (
                      <SearchResultCard key={result.id} result={result} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <Loading />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
