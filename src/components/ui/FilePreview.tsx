import { FileCheckIcon, FileUpIcon, Trash2Icon, XIcon } from "lucide-react";
import { useMemo } from "react";

import { useFileData } from "@/hooks/queries/useFileData";
import { formatFileSize } from "@/utils";

import { Button } from "./Button";
import { Progress } from "./Progress";

interface FilePreviewProps {
  file?: File | null;
  fileId: string | null;
  onDelete?: () => void;
  onCancel?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  fileId,
  onDelete,
  onCancel,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const { data: fileData } = useFileData(fileId);

  const fileSize = useMemo(() => {
    if (fileData?.size !== undefined) {
      return formatFileSize(fileData.size);
    }

    if (file?.size !== undefined) {
      return formatFileSize(file.size);
    }

    return null;
  }, [fileData, file]);

  return (
    <div className="bg-card flex items-center justify-between rounded-md border border-neutral-300 p-4">
      <div className="flex flex-1 gap-2">
        <div>
          <div className="rounded-full border border-neutral-300 p-2">
            {isUploading ? (
              <FileUpIcon className="h-5 w-5" />
            ) : (
              <FileCheckIcon className="h-5 w-5" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium">{fileData?.name ?? file?.name}</p>
          <div className="text-muted-foreground text-sm">
            {isUploading ? (
              <div className="p-1">
                <Progress value={uploadProgress} className="h-1" />
              </div>
            ) : (
              <div>{fileSize}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        {isUploading
          ? onCancel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="hover:text-error"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )
          : onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="hover:text-error"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            )}
      </div>
    </div>
  );
};
