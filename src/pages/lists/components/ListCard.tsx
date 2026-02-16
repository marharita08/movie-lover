import { FilePreview } from "@/components/ui/FilePreview";
import type { ListResponse } from "@/types";

import { DeleteListDialog } from "./DeleteListDialog";

interface ListCardProps {
  list: ListResponse;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  return (
    <div className="bg-card flex flex-col gap-2 rounded-md border border-neutral-300 px-4 py-6 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{list.name}</p>
        <DeleteListDialog listName={list.name} listId={list.id} />
      </div>
      <FilePreview fileId={list.fileId} />
    </div>
  );
};
