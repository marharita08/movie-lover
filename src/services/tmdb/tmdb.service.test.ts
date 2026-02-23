import { beforeEach, describe, expect, it, vi } from "vitest";

import { httpService } from "../http/http.service";
import { TMDBService } from "./tmdb.service";

vi.mock("../http/http.service", () => ({
  httpService: {
    get: vi.fn(),
  },
}));

describe("TMDBService", () => {
  let tmdbService: TMDBService;

  beforeEach(() => {
    tmdbService = new TMDBService();
    vi.clearAllMocks();
  });

  describe("getDiscoverMovies", () => {
    it("calls httpService.get with correct url and query", async () => {
      const query = { page: 1, sort_by: "popularity.desc" };
      vi.mocked(httpService.get).mockResolvedValue({
        results: [],
        total_pages: 1,
      });

      await tmdbService.getDiscoverMovies(query);

      expect(httpService.get).toHaveBeenCalledWith(
        "/tmdb/discover/movie",
        query,
      );
    });
  });

  describe("getMovie", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({
        id: "123",
        title: "Inception",
      });

      await tmdbService.getMovie("123");

      expect(httpService.get).toHaveBeenCalledWith("/tmdb/movie/123");
    });
  });

  describe("getTVShow", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({
        id: "456",
        name: "Breaking Bad",
      });

      await tmdbService.getTVShow("456");

      expect(httpService.get).toHaveBeenCalledWith("/tmdb/tv/456");
    });
  });
});
