import { useEffect, useRef, useState } from "react";

import { TranslationKey } from "@/const";
import { toast, useDeleteFile, useFileData, useTranslation } from "@/hooks";
import { fileService } from "@/services";

import { FileInput, FilePreview } from "../../ui";

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
  const { t } = useTranslation();
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
            title: t(TranslationKey.FILE_UPLOADER_CANCELLED),
          });
        } else {
          toast({
            variant: "destructive",
            title: t(TranslationKey.FILE_UPLOADER_FAILED),
            description:
              error instanceof Error
                ? error.message
                : t(TranslationKey.COMMON_UNKNOWN_ERROR),
          });
        }
      } finally {
        setIsUploading(false);
        abortControllerRef.current = null;
      }
    };

    handleUpload();
  }, [file, setFileId, t]);

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
