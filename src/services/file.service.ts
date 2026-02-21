import type { FileResponse } from "@/types";

import { httpService, type QueryParams } from "./http.service";

class FileService {
  async upload(
    file: File,
    params?: QueryParams,
    options?: {
      onUploadProgress?: (progress: number) => void;
      signal?: AbortSignal;
    },
  ) {
    return httpService.upload<FileResponse>(
      "/file/upload",
      file,
      "file",
      params,
      options,
    );
  }

  async getById(id: string) {
    return httpService.get<FileResponse>(`/file/${id}`);
  }

  async delete(id: string) {
    return httpService.delete<FileResponse>(`/file/${id}`);
  }
}

export const fileService = new FileService();
