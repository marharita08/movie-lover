import { PaperclipIcon } from "lucide-react";
import { useRef, useState } from "react";

import { toast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

interface FileInputProps {
  onChange: (file: File) => void;
  validTypes: string[];
}

export const FileInput: React.FC<FileInputProps> = ({
  onChange,
  validTypes,
}) => {
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
        title: "Invalid file type",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (validTypes.some((type) => file.type.indexOf(type) !== -1)) {
      onChange(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "bg-card h-[128px] cursor-pointer rounded-lg border border-neutral-300 p-4 text-center",
        isDragging && "border-primary",
      )}
      onClick={openFileDialog}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-2">
        <div className="flex justify-center">
          <PaperclipIcon className="text-neutral-600" />
        </div>

        {isDragging ? (
          <p className="p-3 text-sm font-medium">Drop file here</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Drag and drop file here</p>
              <p className="text-xs">
                or <span className="text-primary">click</span> to browse
              </p>
            </div>
            <p className="text-xs text-neutral-700">
              Only {validTypes.join(", ")} files are allowed
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
    </div>
  );
};
