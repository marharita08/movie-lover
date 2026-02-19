import { type AnaliticsResponse } from "@/types/analitics.type";

import { httpService } from "./http.service";

class AnaliticsService {
  async analize(listId: string): Promise<AnaliticsResponse> {
    return httpService.get<AnaliticsResponse>(`/analitics/list/${listId}`);
  }
}

export const analiticsService = new AnaliticsService();
