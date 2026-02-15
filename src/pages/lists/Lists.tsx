import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { AuthenticatedLayout, Button, Loading } from "@/components";
import { RouterKey } from "@/const";
import { useLists } from "@/hooks/queries/useLists";
import { ListCard } from "./components";

export const Lists = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useLists({});

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lists = data?.pages.flatMap((page) => page.results) ?? [];

  const isEmpty = lists.length === 0 && !isLoading;

  return (
    <AuthenticatedLayout>
      <div className="flex items-center justify-between pr-4">
        <h1 className="text-xl font-bold">Lists</h1>
        <Button asChild variant="outline">
          <Link to={RouterKey.CREATE_LIST}>
            <PlusIcon className="h-4 w-4" />
            Create List
          </Link>
        </Button>
      </div>
      <div>
        {!isEmpty && !isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
            <div ref={ref} className="h-10" />
          </div>
        )}
        {isEmpty && (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No lists found</p>
          </div>
        )}
        {(isLoading || isFetchingNextPage) && <Loading />}
      </div>
    </AuthenticatedLayout>
  );
};
