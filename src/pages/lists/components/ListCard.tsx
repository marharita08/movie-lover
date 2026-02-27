import { AlertTriangleIcon } from "lucide-react";
import { generatePath, Link } from "react-router-dom";

import { Button } from "@/components";
import { FilePreview } from "@/components";
import { RouterKey } from "@/const";
import { ListStatus } from "@/const/list-status";
import type { ListResponse } from "@/types";

import { DeleteListDialog } from "./DeleteListDialog";

interface ListCardProps {
  list: ListResponse;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  return (
    <div className="bg-card flex h-fit flex-col gap-2 rounded-md border border-neutral-300 px-4 py-6 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{list.name}</p>
        <DeleteListDialog listName={list.name} listId={list.id} />
      </div>
      <FilePreview fileId={list.fileId} />
      <div>
        {list.status === ListStatus.COMPLETED && (
          <Button variant="ghost" asChild>
            <Link to={generatePath(RouterKey.LIST, { id: list.id })}>
              View analitics
            </Link>
          </Button>
        )}
        {list.status === ListStatus.PROCESSING && (
          <div className="text-muted-foreground">Processing...</div>
        )}
        {list.status === ListStatus.FAILED && (
          <div className="bg-error/10 flex items-start gap-4 rounded-md p-4">
            <div
              className={
                "bg-error text-error-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              }
            >
              <AlertTriangleIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-medium">
                An error occurred while processing your list.
              </div>
              {list.errorMessage && (
                <div className="text-muted-foreground text-xs">
                  {list.errorMessage}
                </div>
              )}
              <div className="text-sm">
                Please create a new list with valid IMDB list.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
