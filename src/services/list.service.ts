import type { CreateListValidationSchemaType } from "@/pages/create-list/validation";
import type { ShortMovie } from "@/types";
import type { GenreStats } from "@/types/genre-stats.type";
import type { GetListsQuery } from "@/types/get-lists-query.type";
import type { GetMediaItemsQuery } from "@/types/get-media-items-query.type";
import type { GetPersonStatsQuery } from "@/types/get-person-stats-query.type";
import type { ListResponse } from "@/types/list-response.type";
import type { PaginatedResponse } from "@/types/paginated-response.type";
import type { PersonStatsItem } from "@/types/person-stats.type";

import { httpService } from "./http.service";

class ListService {
  async create(data: CreateListValidationSchemaType): Promise<ListResponse> {
    return await httpService.post<ListResponse, CreateListValidationSchemaType>(
      "/list",
      data,
    );
  }

  async getAll(query: GetListsQuery): Promise<PaginatedResponse<ListResponse>> {
    return await httpService.get<PaginatedResponse<ListResponse>>(
      "/list",
      query,
    );
  }

  async delete(id: string): Promise<void> {
    return await httpService.delete(`/list/${id}`);
  }

  async getGenreStats(listId: string): Promise<GenreStats> {
    return await httpService.get<GenreStats>(`/list/${listId}/genre/stats`);
  }

  async getPersonStats(
    listId: string,
    query: GetPersonStatsQuery,
  ): Promise<PaginatedResponse<PersonStatsItem>> {
    return await httpService.get<PaginatedResponse<PersonStatsItem>>(
      `/list/${listId}/person/stats`,
      query,
    );
  }

  async getMediaItems(listId: string, query: GetMediaItemsQuery) {
    return await httpService.get<PaginatedResponse<ShortMovie>>(
      `/list/${listId}/media`,
      query,
    );
  }
}

export const listService = new ListService();
