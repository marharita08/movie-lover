import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import {
  AuthenticatedLayout,
  Button,
  EmptyState,
  ErrorState,
  Input,
  Loading,
} from "@/components";
import { RouterKey } from "@/const";
import { useDebounce } from "@/hooks";
import { useLists } from "@/hooks/queries/useLists";

import { ListCard } from "./components";

export const Lists = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
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
    <AuthenticatedLayout>
      <div className="p-4 md:p-0">
        <div className="flex items-center justify-between md:pr-4">
          <h1 className="text-xl font-bold">Lists</h1>
          <Button asChild variant="outline">
            <Link to={RouterKey.CREATE_LIST}>
              <PlusIcon className="h-4 w-4" />
              Create List
            </Link>
          </Button>
        </div>

        <div className="mt-4 mb-6 max-w-md">
          <Input
            placeholder="Search lists by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon className="h-4 w-4" />}
          />
        </div>

        <div className="h-full flex-1">
          {isError && (
            <ErrorState
              title="Failed to load your lists"
              description="We couldn't fetch your movie lists. Please try again."
              onRetry={() => refetch()}
              type="server"
            />
          )}
          {!isEmpty && !isLoading && !isError && (
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
                  ? "No matching lists found"
                  : "Ready to analyze your cinema history?"
              }
              description={
                debouncedSearch
                  ? `We couldn't find any lists matching "${debouncedSearch}". Try a different name.`
                  : "Upload your IMDB export file to create a list and unlock detailed analytics about your movie collection."
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
    </AuthenticatedLayout>
  );
};
