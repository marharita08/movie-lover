import { beforeEach, describe, expect, it, vi } from "vitest";

import { httpService } from "../http/http.service";
import { FileService } from "./file.service";

vi.mock("../http/http.service", () => ({
  httpService: {
    upload: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("FileService", () => {
  let fileService: FileService;

  beforeEach(() => {
    fileService = new FileService();
    vi.clearAllMocks();
  });

  describe("upload", () => {
    it("calls httpService.upload with correct arguments", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const params = { folder: "avatars" };
      const options = { onUploadProgress: vi.fn() };

      vi.mocked(httpService.upload).mockResolvedValue({
        id: "1",
        url: "http://example.com/test.txt",
      });

      await fileService.upload(file, params, options);

      expect(httpService.upload).toHaveBeenCalledWith(
        "/file/upload",
        file,
        "file",
        params,
        options,
      );
    });

    it("calls httpService.upload without optional params", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });

      vi.mocked(httpService.upload).mockResolvedValue({
        id: "1",
        url: "http://example.com/test.txt",
      });

      await fileService.upload(file);

      expect(httpService.upload).toHaveBeenCalledWith(
        "/file/upload",
        file,
        "file",
        undefined,
        undefined,
      );
    });
  });

  describe("getById", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({
        id: "123",
        url: "http://example.com/file.txt",
      });

      await fileService.getById("123");

      expect(httpService.get).toHaveBeenCalledWith("/file/123");
    });
  });

  describe("delete", () => {
    it("calls httpService.delete with correct url", async () => {
      vi.mocked(httpService.delete).mockResolvedValue({
        id: "123",
        url: "http://example.com/file.txt",
      });

      await fileService.delete("123");

      expect(httpService.delete).toHaveBeenCalledWith("/file/123");
    });
  });
});
