import { useEffect, useRef, useState } from "react";

import { toast } from "@/hooks";
import { useDeleteFile } from "@/hooks/mutations/useDeleteFile";
import { useFileData } from "@/hooks/queries/useFileData";
import { fileService } from "@/services/file.service";

import { FileInput } from "./ui/FileInput";
import { FilePreview } from "./ui/FilePreview";

interface FileUploaderProps {
  validTypes: string[];
  fileId: string | null;
  setFileId: (fileId: string | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  validTypes,
  fileId,
  setFileId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: fileData } = useFileData(fileId);

  const handleFileChange = (file: File) => {
    setFile(file);
    setUploadProgress(0);
  };

  useEffect(() => {
    const handleUpload = async () => {
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);
      abortControllerRef.current = new AbortController();

      try {
        const result = await fileService.upload(file, undefined, {
          onUploadProgress: (progress) => {
            setUploadProgress(progress);
          },
          signal: abortControllerRef.current.signal,
        });

        setFileId(result.id);
      } catch (error) {
        if (error instanceof Error && error.message === "Upload aborted") {
          toast({
            variant: "destructive",
            title: "Upload cancelled",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      } finally {
        setIsUploading(false);
        abortControllerRef.current = null;
      }
    };

    handleUpload();
  }, [file, setFileId]);

  const handleCancel = () => {
    abortControllerRef.current?.abort();
  };

  const deleteFileMutation = useDeleteFile();

  const handleDelete = () => {
    if (fileId) {
      deleteFileMutation.mutate(fileId);
    }
    setFileId(null);
  };

  return !fileData && !file ? (
    <FileInput validTypes={validTypes} onChange={handleFileChange} />
  ) : (
    <FilePreview
      file={file}
      fileId={fileId}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  );
};
