import { CircleQuestionMarkIcon } from "lucide-react";
import { useParams } from "react-router-dom";

import { Loading, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { useAmountStats } from "@/hooks";
import { formatRuntime } from "@/utils";
import { useEffect } from "react";
import { ListSection } from "../../const";

interface AmountStatsProps {
  onReady?: (section: ListSection) => void;
}

export const AmountStats: React.FC<AmountStatsProps> = ({ onReady }) => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useAmountStats(id!);

  useEffect(() => {
    if (!isLoading) {
      onReady?.(ListSection.AMOUNT_STATS);
    }
  }, [isLoading, onReady]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 justify-center gap-8 sm:grid-cols-2 md:grid-cols-4">
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
        <div className="flex items-center gap-1">
          <div className="text-muted-foreground font-medium">
            Total TV shows runtime
          </div>
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMarkIcon className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              Approximate runtime based on average episode length and episode
              count
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold">
          {formatRuntime(data?.totalRuntime)}
        </div>
        <div className="text-muted-foreground font-medium">Total runtime</div>
      </div>
    </section>
  );
};
