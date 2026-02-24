import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast, useDeleteFile, useFileData } from "@/hooks";
import { fileService } from "@/services";

import { FileUploader } from "./FileUploader";

vi.mock("@/hooks", () => ({
  toast: vi.fn(),
  useDeleteFile: vi.fn(),
  useFileData: vi.fn(),
}));

vi.mock("@/services", () => ({
  fileService: {
    upload: vi.fn(),
  },
}));

vi.mock("../../ui", () => ({
  FileInput: ({ onChange }: { onChange: (file: File) => void }) => (
    <input
      data-testid="file-input"
      type="file"
      onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
    />
  ),
  FilePreview: ({
    isUploading,
    uploadProgress,
    onCancel,
    onDelete,
  }: {
    isUploading: boolean;
    uploadProgress: number;
    onCancel: () => void;
    onDelete: () => void;
  }) => (
    <div data-testid="file-preview">
      {isUploading && <span>Uploading {uploadProgress}%</span>}
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

const createFile = (name: string, type: string) =>
  new File(["content"], name, { type });

describe("FileUploader", () => {
  const setFileId = vi.fn();
  const mutate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteFile).mockReturnValue({ mutate } as never);
    vi.mocked(useFileData).mockReturnValue({ data: null } as never);
  });

  it("shows FileInput when no file and no fileData", () => {
    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId={null}
        setFileId={setFileId}
      />,
    );
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("shows FilePreview after file is selected", async () => {
    vi.mocked(fileService.upload).mockResolvedValue({
      id: "file-123",
    } as never);

    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId={null}
        setFileId={setFileId}
      />,
    );

    const input = screen.getByTestId("file-input");
    await user.upload(input, createFile("photo.png", "image/png"));

    expect(screen.getByTestId("file-preview")).toBeInTheDocument();
  });

  it("calls fileService.upload after file is selected", async () => {
    vi.mocked(fileService.upload).mockResolvedValue({
      id: "file-123",
    } as never);

    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId={null}
        setFileId={setFileId}
      />,
    );

    const input = screen.getByTestId("file-input");
    const file = createFile("photo.png", "image/png");
    await user.upload(input, file);

    await waitFor(() =>
      expect(fileService.upload).toHaveBeenCalledWith(
        file,
        undefined,
        expect.objectContaining({
          onUploadProgress: expect.any(Function),
          signal: expect.any(AbortSignal),
        }),
      ),
    );
  });

  it("calls setFileId with result id after successful upload", async () => {
    vi.mocked(fileService.upload).mockResolvedValue({
      id: "file-123",
    } as never);

    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId={null}
        setFileId={setFileId}
      />,
    );

    await user.upload(
      screen.getByTestId("file-input"),
      createFile("photo.png", "image/png"),
    );

    await waitFor(() => expect(setFileId).toHaveBeenCalledWith("file-123"));
  });

  it("shows toast on upload error", async () => {
    vi.mocked(fileService.upload).mockRejectedValue(new Error("Server error"));

    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId={null}
        setFileId={setFileId}
      />,
    );

    await user.upload(
      screen.getByTestId("file-input"),
      createFile("photo.png", "image/png"),
    );

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Upload failed",
        description: "Server error",
      }),
    );
  });

  it("shows toast on upload abort", async () => {
    vi.mocked(fileService.upload).mockRejectedValue(
      new Error("Upload aborted"),
    );

    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId={null}
        setFileId={setFileId}
      />,
    );

    await user.upload(
      screen.getByTestId("file-input"),
      createFile("photo.png", "image/png"),
    );

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Upload cancelled",
      }),
    );
  });

  it("calls deleteFileMutation.mutate and setFileId on delete", async () => {
    vi.mocked(useFileData).mockReturnValue({
      data: { id: "file-123", url: "http://example.com" },
    } as never);

    render(
      <FileUploader
        validTypes={["image/png"]}
        fileId="file-123"
        setFileId={setFileId}
      />,
    );

    await user.click(screen.getByText("Delete"));

    expect(mutate).toHaveBeenCalledWith("file-123");
    expect(setFileId).toHaveBeenCalledWith(null);
  });
});
