import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  EmptyState,
  ErrorState,
  Input,
  Loading,
  Person,
} from "@/components";
import { PersonRole, personRoleMap } from "@/const";
import { useIsMobile, usePersonStats, useSearch } from "@/hooks";
import type { PersonStatsItem } from "@/types";

export const PersonsAnalytics = () => {
  const { id, role } = useParams<{ id: string; role: PersonRole }>();
  const { search, setSearch, debouncedSearch } = useSearch();
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const roleParsed = role as PersonRole;
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePersonStats(id!, {
    role: roleParsed,
    limit: 20,
    search: debouncedSearch,
  });

  const analitics = data?.pages.flatMap((page) => page.results) || [];

  const columnsCount = isMobile ? 1 : 2;
  const rows: PersonStatsItem[][] = [];
  for (let i = 0; i < analitics.length; i += columnsCount) {
    rows.push(analitics.slice(i, i + columnsCount));
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

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

  return (
    <div className="flex h-[calc(100vh-88px)] flex-col overflow-hidden px-2">
      <div className="bg-background flex shrink-0 items-center gap-2 px-2 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden md:block">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">{personRoleMap[roleParsed]}</h1>
        <search className="ml-2 flex-1 md:ml-6">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon className="h-4 w-4" />}
            maxLength={255}
            className="max-w-md"
          />
        </search>
      </div>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Loading />
        </div>
      )}
      {isError && (
        <div className="flex-1 overflow-auto">
          <ErrorState
            title="Failed to load persons analitics"
            error={error}
            onRetry={refetch}
          />
        </div>
      )}
      {!isLoading && !isError && analitics?.length === 0 && (
        <div className="flex-1 overflow-auto">
          <EmptyState
            title={`No ${personRoleMap[roleParsed]} found`}
            description={`No ${personRoleMap[roleParsed]} found in your list`}
          />
        </div>
      )}
      {analitics.length > 0 && (
        <div ref={parentRef} className="flex-1 overflow-auto">
          <div
            className="relative w-full"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className="absolute top-0 left-0 w-full"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <div className="grid grid-cols-1 gap-4 px-0 pb-4 md:grid-cols-2 md:px-4">
                    {row.map((person) => (
                      <Person key={person.id} person={person} />
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
