import type { CreateListValidationSchemaType } from "@/pages";
import type {
  GenreStats,
  GetAmountStatsResponse,
  GetListsQuery,
  GetMediaItemsQuery,
  GetMediaTypeStatsResponse,
  GetPersonStatsQuery,
  GetRatingStatsQuery,
  ListResponse,
  PaginatedResponse,
  PersonStatsItem,
  ShortMedia,
} from "@/types";

import { httpService } from "../http/http.service";

export class ListService {
  async create(data: CreateListValidationSchemaType): Promise<ListResponse> {
    return httpService.post<ListResponse, CreateListValidationSchemaType>(
      "/list",
      data,
    );
  }

  async getAll(query: GetListsQuery): Promise<PaginatedResponse<ListResponse>> {
    return httpService.get<PaginatedResponse<ListResponse>>("/list", query);
  }

  async delete(id: string): Promise<void> {
    return httpService.delete(`/list/${id}`);
  }

  async getGenreStats(listId: string): Promise<GenreStats> {
    return httpService.get<GenreStats>(`/list/${listId}/genre/stats`);
  }

  async getPersonStats(
    listId: string,
    query: GetPersonStatsQuery,
  ): Promise<PaginatedResponse<PersonStatsItem>> {
    return httpService.get<PaginatedResponse<PersonStatsItem>>(
      `/list/${listId}/person/stats`,
      query,
    );
  }

  async getMediaItems(listId: string, query: GetMediaItemsQuery) {
    return httpService.get<PaginatedResponse<ShortMedia>>(
      `/list/${listId}/media`,
      query,
    );
  }

  async getMediaTypeStats(listId: string) {
    return httpService.get<GetMediaTypeStatsResponse>(
      `/list/${listId}/media-type/stats`,
    );
  }

  async getGenres(listId: string) {
    return httpService.get<string[]>(`/list/${listId}/genres`);
  }

  async getYears(listId: string) {
    return httpService.get<number[]>(`/list/${listId}/years`);
  }

  async getRatingStats(listId: string, query: GetRatingStatsQuery) {
    return httpService.get<Record<string, number>>(
      `/list/${listId}/rating/stats`,
      query,
    );
  }

  async getYearsStats(listId: string) {
    return httpService.get<Record<string, number>>(
      `/list/${listId}/years/stats`,
    );
  }

  async getAmountStats(listId: string) {
    return httpService.get<GetAmountStatsResponse>(
      `/list/${listId}/amount/stats`,
    );
  }

  async getUpcomingTVShows(listId: string, query: GetMediaItemsQuery) {
    return httpService.get<PaginatedResponse<ShortMedia>>(
      `/list/${listId}/tv/upcoming`,
      query,
    );
  }

  async getCountryStats(listId: string) {
    return httpService.get<Record<string, number>>(
      `/list/${listId}/country/stats`,
    );
  }

  async getCompanyStats(listId: string) {
    return httpService.get<Record<string, number>>(
      `/list/${listId}/company/stats`,
    );
  }
}

export const listService = new ListService();
