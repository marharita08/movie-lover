import type { Language } from "@/const";

export type DiscoverMoviesQuery = {
  page?: number;
  primaryReleaseYear?: number;
  sortBy?: string;
  language?: Language;
};
