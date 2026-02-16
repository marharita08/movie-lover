import { Trash2Icon } from "lucide-react";

import { Button } from "@/components";
import { FilePreview } from "@/components/ui/FilePreview";
import { useDeleteList } from "@/hooks";
import type { ListResponse } from "@/types";

interface ListCardProps {
  list: ListResponse;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const { mutate: deleteList, isPending: isDeleting } = useDeleteList();

  return (
    <div className="bg-card flex flex-col gap-2 rounded-md border border-neutral-300 px-4 py-6 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{list.name}</p>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-error"
          onClick={() => deleteList(list.id)}
          disabled={isDeleting}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
      <FilePreview fileId={list.fileId} />
    </div>
  );
};
