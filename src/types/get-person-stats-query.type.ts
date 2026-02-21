import type { PersonRole } from "@/const";

export type GetPersonStatsQuery = {
  role: PersonRole;
  limit?: number;
  page?: number;
};
