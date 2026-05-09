import type { Language } from "@/const";

export type MultiSearchQuery = {
  query: string;
  page?: number;
  language?: Language;
};
