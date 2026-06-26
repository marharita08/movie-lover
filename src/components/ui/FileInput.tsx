import { PaperclipIcon } from "lucide-react";
import { useRef, useState } from "react";

import { TranslationKey } from "@/const";
import { toast, useTranslation } from "@/hooks";
import { cn } from "@/utils";

interface FileInputProps {
  onChange: (file: File) => void;
  validTypes: string[];
}

export const FileInput: React.FC<FileInputProps> = ({
  onChange,
  validTypes,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validTypes.some((type) => file.type.indexOf(type) !== -1)) {
      onChange(file);
    } else {
      toast({
        variant: "destructive",
        title: t(TranslationKey.FILE_UPLOADER_INVALID_TYPE),
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (validTypes.some((type) => file.type.indexOf(type) !== -1)) {
      onChange(file);
    } else {
      toast({
        variant: "destructive",
        title: t(TranslationKey.FILE_UPLOADER_INVALID_TYPE),
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <button
      type="button"
      className={cn(
        "bg-card h-32 cursor-pointer rounded-lg border border-neutral-300 p-4 text-center",
        isDragging && "border-primary",
      )}
      onClick={openFileDialog}
      data-testid="file-dropzone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-2">
        <div className="flex justify-center">
          <PaperclipIcon className="text-neutral-600" />
        </div>

        {isDragging ? (
          <p className="p-3 text-sm font-medium" data-testid="drop-text">
            {t(TranslationKey.FILE_UPLOADER_DROP_HERE)}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm" data-testid="drag-text">
                {t(TranslationKey.FILE_UPLOADER_DRAG_DROP)}
              </p>
              <p className="text-xs">
                {t(TranslationKey.FILE_UPLOADER_OR)}{" "}
                <span className="text-primary">
                  {t(TranslationKey.FILE_UPLOADER_CLICK_BROWSE)}
                </span>{" "}
                {t(TranslationKey.FILE_UPLOADER_TO_BROWSE)}
              </p>
            </div>
            <p className="text-xs text-neutral-700" data-testid="file-types">
              {t(TranslationKey.FILE_UPLOADER_ONLY_TYPES).replace(
                "{{types}}",
                validTypes.join(", "),
              )}
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={validTypes.join(",")}
        onChange={handleChange}
        className="hidden"
      />
    </button>
  );
};
