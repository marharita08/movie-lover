import type { PersonRole } from "@/const";

export type GetPersonStatsQuery = {
  role: PersonRole;
  search?: string;
  limit?: number;
  page?: number;
};
