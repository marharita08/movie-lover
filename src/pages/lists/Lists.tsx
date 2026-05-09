import { AlertTriangleIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Button, EmptyState, ErrorState, Input, Loading } from "@/components";
import { RouterKey, TranslationKey } from "@/const";
import { useLists, useSearch, useTranslation } from "@/hooks";

import { ListCard } from "./components";

export const Lists = () => {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useLists({ name: debouncedSearch });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lists = data?.pages.flatMap((page) => page.results) ?? [];

  const isEmpty = lists.length === 0 && !isLoading && !isError;

  return (
    <div className="p-4 md:p-0">
      <div className="flex items-center justify-between md:pr-4">
        <h1 className="text-xl font-bold">{t(TranslationKey.LISTS_TITLE)}</h1>
        <Button asChild variant="outline">
          <Link to={RouterKey.CREATE_LIST}>
            <PlusIcon className="h-4 w-4" />
            {t(TranslationKey.LISTS_CREATE_LIST)}
          </Link>
        </Button>
      </div>
      {data?.pages && data?.pages[0].totalResults > 10 && (
        <div className="bg-warning/10 mt-2 flex items-center gap-4 rounded-md p-4">
          <div
            className={
              "bg-warning text-warning-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            }
          >
            <AlertTriangleIcon className="h-5 w-5" />
          </div>
          <div>{t(TranslationKey.LISTS_AI_LIMIT_INFO)}</div>
        </div>
      )}

      <search className="mt-4 mb-6 max-w-md">
        <Input
          placeholder={t(TranslationKey.LISTS_SEARCH_PLACEHOLDER)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<SearchIcon className="h-4 w-4" />}
          maxLength={255}
          onClear={() => setSearch("")}
        />
      </search>

      <div className="h-full flex-1 pr-4">
        {isError && (
          <ErrorState
            title={t(TranslationKey.LISTS_LOAD_FAILED_TITLE)}
            description={t(TranslationKey.LISTS_LOAD_FAILED_DESC)}
            error={error}
            onRetry={() => refetch()}
            type="server"
          />
        )}
        {!isEmpty && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
            <div ref={ref} className="h-10" />
          </div>
        )}
        {isEmpty && (
          <EmptyState
            title={
              debouncedSearch
                ? t(TranslationKey.LISTS_EMPTY_MATCH_TITLE)
                : t(TranslationKey.LISTS_EMPTY_TITLE)
            }
            description={
              debouncedSearch
                ? t(TranslationKey.LISTS_EMPTY_MATCH_DESC).replace(
                    "{{search}}",
                    debouncedSearch,
                  )
                : t(TranslationKey.LISTS_EMPTY_DESC)
            }
            icon={"film"}
          />
        )}
        {(isLoading || isFetchingNextPage) && (
          <div className="flex justify-center pt-16">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};
