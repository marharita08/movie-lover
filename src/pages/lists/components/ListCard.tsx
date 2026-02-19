import { generatePath, Link } from "react-router-dom";

import { Button } from "@/components";
import { FilePreview } from "@/components/ui/FilePreview";
import { RouterKey } from "@/const";
import type { ListResponse } from "@/types";

import { DeleteListDialog } from "./DeleteListDialog";

interface ListCardProps {
  list: ListResponse;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  return (
    <div className="bg-card flex cursor-pointer flex-col gap-2 rounded-md border border-neutral-300 px-4 py-6 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{list.name}</p>
        <DeleteListDialog listName={list.name} listId={list.id} />
      </div>
      <FilePreview fileId={list.fileId} />
      <div>
        <Button variant="ghost">
          <Link to={generatePath(RouterKey.LIST, { id: list.id })}>
            View analitics
          </Link>
        </Button>
      </div>
    </div>
  );
};
