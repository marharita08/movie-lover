import type { PersonRole } from "@/const/person-role";

export type GetPersonStatsQuery = {
  role: PersonRole;
  limit?: number;
  page?: number;
};
