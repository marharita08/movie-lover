import { FilePreview } from "@/components/ui/FilePreview";
import type { ListResponse } from "@/types";

interface ListCardProps {
  list: ListResponse;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  return (
    <div className="bg-card flex flex-col gap-2 rounded-md border border-neutral-300 px-4 py-6 shadow-md">
      <p className="text-lg font-semibold">{list.name}</p>
      <FilePreview fileId={list.fileId} />
    </div>
  );
};
