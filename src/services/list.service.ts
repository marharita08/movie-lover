import type { CreateListValidationSchemaType } from "@/pages/create-list/validation";
import type { GetListsQuery } from "@/types/get-lists-query.type";
import type { ListResponse } from "@/types/list-response.type";
import type { PaginatedResponse } from "@/types/paginated-response.type";

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
}

export const listService = new ListService();
