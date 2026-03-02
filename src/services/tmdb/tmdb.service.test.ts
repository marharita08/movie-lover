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

  describe("getPerson", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({
        id: "789",
        name: "Leonardo DiCaprio",
        knownForDepartment: "Acting",
      });

      await tmdbService.getPerson("789");

      expect(httpService.get).toHaveBeenCalledWith("/tmdb/person/789");
    });
  });

  describe("multiSearch", () => {
    it("calls httpService.get with correct url and query", async () => {
      const query = { query: "inception", page: 1 };
      vi.mocked(httpService.get).mockResolvedValue({
        results: [
          {
            id: 1,
            mediaType: "movie",
            title: "Inception",
          },
        ],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      });

      await tmdbService.multiSearch(query);

      expect(httpService.get).toHaveBeenCalledWith("/tmdb/search/multi", query);
    });

    it("returns paginated response with mixed media types", async () => {
      const query = { query: "avatar", page: 1 };
      const mockResponse = {
        results: [
          {
            id: 1,
            mediaType: "movie",
            title: "Avatar",
          },
          {
            id: 2,
            mediaType: "tv",
            name: "Avatar: The Last Airbender",
          },
          {
            id: 3,
            mediaType: "person",
            name: "Sam Worthington",
          },
        ],
        page: 1,
        totalPages: 5,
        totalResults: 50,
      };

      vi.mocked(httpService.get).mockResolvedValue(mockResponse);

      const result = await tmdbService.multiSearch(query);

      expect(result).toEqual(mockResponse);
      expect(result.results).toHaveLength(3);
    });
  });
});
