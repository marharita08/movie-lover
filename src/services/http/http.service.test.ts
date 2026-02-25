import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAccessTokenStore } from "@/store/access-token.store";

import { HttpService } from "./http.service";

vi.mock("@/store/access-token.store", () => ({
  useAccessTokenStore: {
    getState: vi.fn(),
  },
}));

const mockFetch = (
  status: number,
  body: unknown,
  contentType = "application/json",
) => {
  return vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => contentType },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(String(body)),
  });
};

const mockGetState = (accessToken?: string) => {
  const setAccessToken = vi.fn();
  const removeAccessToken = vi.fn();

  vi.mocked(useAccessTokenStore.getState).mockReturnValue({
    accessToken,
    setAccessToken,
    removeAccessToken,
  });

  return { setAccessToken, removeAccessToken };
};

describe("HttpService", () => {
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpService("http://localhost:3000");
    mockGetState();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("buildQuery", () => {
    it("adds query string to url", async () => {
      vi.stubGlobal("fetch", mockFetch(200, {}));
      await httpService.get("/test", { page: 1, search: "hello" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("?page=1&search=hello"),
        expect.any(Object),
      );
    });

    it("skips null and undefined params", async () => {
      vi.stubGlobal("fetch", mockFetch(200, {}));
      await httpService.get("/test", { page: null, search: undefined });
      expect(fetch).toHaveBeenCalledWith(
        expect.not.stringContaining("?"),
        expect.any(Object),
      );
    });

    it("handles array params", async () => {
      vi.stubGlobal("fetch", mockFetch(200, {}));
      await httpService.get("/test", { ids: [1, 2, 3] });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("ids=1&ids=2&ids=3"),
        expect.any(Object),
      );
    });

    it("returns empty string if params are not provided", async () => {
      vi.stubGlobal("fetch", mockFetch(200, {}));
      await httpService.get("/test");
      expect(fetch).toHaveBeenCalledWith(
        expect.not.stringContaining("?"),
        expect.any(Object),
      );
    });
  });

  describe("request", () => {
    it("adds Authorization header when token exists", async () => {
      mockGetState("my-token");
      vi.stubGlobal("fetch", mockFetch(200, {}));

      await httpService.get("/test");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        }),
      );
    });

    it("does not add Authorization header when token is missing", async () => {
      mockGetState(undefined);
      vi.stubGlobal("fetch", mockFetch(200, {}));

      await httpService.get("/test");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        }),
      );
    });

    it("throws HttpException on non-ok response", async () => {
      vi.stubGlobal("fetch", mockFetch(404, { message: "Not found" }));
      await expect(httpService.get("/test")).rejects.toThrow();
    });

    it("parses json response when content-type is application/json", async () => {
      vi.stubGlobal("fetch", mockFetch(200, { id: 1 }));
      const result = await httpService.get("/test");
      expect(result).toEqual({ id: 1 });
    });

    it("parses text response when content-type is not application/json", async () => {
      vi.stubGlobal("fetch", mockFetch(200, "plain text", "text/plain"));
      const result = await httpService.get("/test");
      expect(result).toBe("plain text");
    });
  });

  describe("handle401", () => {
    it("refreshes token and retries request on 401", async () => {
      const { setAccessToken } = mockGetState("old-token");

      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValueOnce({
            status: 401,
            ok: false,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({}),
          })
          .mockResolvedValueOnce({
            status: 200,
            ok: true,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({ accessToken: "new-token" }),
          })
          .mockResolvedValueOnce({
            status: 200,
            ok: true,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({ data: "ok" }),
          }),
      );

      const result = await httpService.get("/test");

      expect(setAccessToken).toHaveBeenCalledWith("new-token");
      expect(result).toEqual({ data: "ok" });
    });

    it("clears token and throws if refresh fails", async () => {
      const { removeAccessToken } = mockGetState("old-token");

      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValueOnce({
            status: 401,
            ok: false,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({}),
          })
          .mockResolvedValueOnce({
            status: 401,
            ok: false,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({}),
          }),
      );

      await expect(httpService.get("/test")).rejects.toThrow("Unauthorized");
      expect(removeAccessToken).toHaveBeenCalled();
    });

    it("does not retry on 401 for login url", async () => {
      mockGetState("old-token");

      vi.stubGlobal("fetch", mockFetch(401, { message: "Unauthorized" }));

      await expect(httpService.get("/auth/login")).rejects.toThrow();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
