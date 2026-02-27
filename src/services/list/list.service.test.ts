import { beforeEach, describe, expect, it, vi } from "vitest";

import { PersonRole } from "@/const";

import { httpService } from "../http/http.service";
import { ListService } from "./list.service";

vi.mock("../http/http.service", () => ({
  httpService: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ListService", () => {
  let listService: ListService;

  beforeEach(() => {
    listService = new ListService();
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { name: "My List", fileId: "uuid" };
      vi.mocked(httpService.post).mockResolvedValue({
        id: "1",
        name: "My List",
      });

      await listService.create(data);

      expect(httpService.post).toHaveBeenCalledWith("/list", data);
    });
  });

  describe("getAll", () => {
    it("calls httpService.get with correct url and query", async () => {
      const query = { page: 1, limit: 10 };
      vi.mocked(httpService.get).mockResolvedValue({ results: [], total: 0 });

      await listService.getAll(query);

      expect(httpService.get).toHaveBeenCalledWith("/list", query);
    });
  });

  describe("delete", () => {
    it("calls httpService.delete with correct url", async () => {
      vi.mocked(httpService.delete).mockResolvedValue(undefined);

      await listService.delete("123");

      expect(httpService.delete).toHaveBeenCalledWith("/list/123");
    });
  });

  describe("getGenreStats", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({ genres: [] });

      await listService.getGenreStats("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/genre/stats");
    });
  });

  describe("getPersonStats", () => {
    it("calls httpService.get with correct url and query", async () => {
      const query = { role: PersonRole.ACTOR, page: 1, limit: 10 };
      vi.mocked(httpService.get).mockResolvedValue({ results: [], total: 0 });

      await listService.getPersonStats("123", query);

      expect(httpService.get).toHaveBeenCalledWith(
        "/list/123/person/stats",
        query,
      );
    });
  });

  describe("getMediaItems", () => {
    it("calls httpService.get with correct url and query", async () => {
      const query = { page: 1, limit: 10 };
      vi.mocked(httpService.get).mockResolvedValue({ results: [], total: 0 });

      await listService.getMediaItems("123", query);

      expect(httpService.get).toHaveBeenCalledWith("/list/123/media", query);
    });
  });

  describe("getMediaTypeStats", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({ movie: 10, tv: 5 });

      await listService.getMediaTypeStats("123");

      expect(httpService.get).toHaveBeenCalledWith(
        "/list/123/media-type/stats",
      );
    });
  });

  describe("getGenres", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue(["Action", "Drama"]);

      await listService.getGenres("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/genres");
    });
  });

  describe("getYears", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue([2020, 2021, 2022]);

      await listService.getYears("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/years");
    });
  });

  describe("getRatingStats", () => {
    it("calls httpService.get with correct url and query", async () => {
      const query = { genre: "Action", year: 2020 };
      vi.mocked(httpService.get).mockResolvedValue({ "5": 10, "8": 5 });

      await listService.getRatingStats("123", query);

      expect(httpService.get).toHaveBeenCalledWith(
        "/list/123/rating/stats",
        query,
      );
    });
  });

  describe("getYearsStats", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({ "2020": 5, "2021": 10 });

      await listService.getYearsStats("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/years/stats");
    });
  });

  describe("getAmountStats", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({
        total: 100,
        movies: 60,
        tv: 40,
      });

      await listService.getAmountStats("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/amount/stats");
    });
  });

  describe("getCompanyStats", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({ genres: [] });

      await listService.getCompanyStats("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/company/stats");
    });
  });

  describe("getCountryStats", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({ genres: [] });

      await listService.getCountryStats("123");

      expect(httpService.get).toHaveBeenCalledWith("/list/123/country/stats");
    });
  });
});
