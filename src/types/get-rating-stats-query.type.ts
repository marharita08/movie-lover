import type { MediaType } from "@/const";

export type GetRatingStatsQuery = {
  genre?: string;
  year?: number;
  type?: MediaType;
};
