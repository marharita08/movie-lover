import { CircleQuestionMarkIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Loading, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { TranslationKey } from "@/const";
import { useAmountStats, useTranslation } from "@/hooks";
import { formatRuntime } from "@/utils";

import { ListSection } from "../../const";

interface AmountStatsProps {
  onReady?: (section: ListSection) => void;
}

export const AmountStats: React.FC<AmountStatsProps> = ({ onReady }) => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useAmountStats(id!);
  const { t } = useTranslation();

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
        <div className="text-2xl font-bold" data-testid="amount-total">
          {data?.total}
        </div>
        <div
          className="text-muted-foreground font-medium"
          data-testid="amount-total-label"
        >
          {t(TranslationKey.LIST_AMOUNT_TOTAL_ITEMS)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold" data-testid="amount-movies-runtime">
          {formatRuntime(data?.totalMoviesRuntime)}
        </div>
        <div
          className="text-muted-foreground font-medium"
          data-testid="amount-movies-runtime-label"
        >
          {t(TranslationKey.LIST_AMOUNT_MOVIES_RUNTIME)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold" data-testid="amount-tv-runtime">
          {formatRuntime(data?.totalTVShowsRuntime)}
        </div>
        <div className="flex items-center gap-1">
          <div
            className="text-muted-foreground font-medium"
            data-testid="amount-tv-runtime-label"
          >
            {t(TranslationKey.LIST_AMOUNT_TV_RUNTIME)}
          </div>
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMarkIcon className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              {t(TranslationKey.LIST_AMOUNT_TV_RUNTIME_TOOLTIP)}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold" data-testid="amount-total-runtime">
          {formatRuntime(data?.totalRuntime)}
        </div>
        <div
          className="text-muted-foreground font-medium"
          data-testid="amount-total-runtime-label"
        >
          {t(TranslationKey.LIST_AMOUNT_TOTAL_RUNTIME)}
        </div>
      </div>
    </section>
  );
};
