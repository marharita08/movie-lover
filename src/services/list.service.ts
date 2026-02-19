import type { PersonRole } from "@/const/person-role";
import type { CreateListValidationSchemaType } from "@/pages/create-list/validation";
import type { GenreStats } from "@/types/genre-stats.type";
import type { GetListsQuery } from "@/types/get-lists-query.type";
import type { ListResponse } from "@/types/list-response.type";
import type { PaginatedResponse } from "@/types/paginated-response.type";
import type { PersonStats } from "@/types/person-stats.type";

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

  async getPersonStats(listId: string, role: PersonRole): Promise<PersonStats> {
    return await httpService.get<PersonStats>(`/list/${listId}/person/stats`, {
      role,
    });
  }
}

export const listService = new ListService();
