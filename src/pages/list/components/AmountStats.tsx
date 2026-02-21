import { useParams } from "react-router-dom";

import { Loading } from "@/components";
import { useAmountStats } from "@/hooks";
import { formatRuntime } from "@/utils";

export const AmountStats = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useAmountStats(id!);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return null;
  }

  return (
    <div className="flex justify-center gap-8">
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold">{data?.total}</div>
        <div className="text-muted-foreground font-medium">Total items</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold">
          {formatRuntime(data?.totalMoviesRuntime)}
        </div>
        <div className="text-muted-foreground font-medium">
          Total movies runtime
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold">
          {formatRuntime(data?.totalTVShowsRuntime)}
        </div>
        <div className="text-muted-foreground font-medium">
          Total TV shows runtime
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold">
          {formatRuntime(data?.totalRuntime)}
        </div>
        <div className="text-muted-foreground font-medium">Total runtime</div>
      </div>
    </div>
  );
};
