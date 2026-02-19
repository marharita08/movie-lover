import type { PersonRole } from "@/const/person-role";

export type PersonStatsItem = {
  id: string;
  imdbId: string | null;
  name: string;
  profilePath: string;
  itemCount: number;
  titles: string;
};

export type PersonStats = {
  role: PersonRole;
  persons: PersonStatsItem[];
};
