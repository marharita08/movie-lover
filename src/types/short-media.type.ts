import { MediaType } from "@/const";

export interface ShortMedia {
  id: number;
  posterPath: string | null;
  title: string;
  type: MediaType;
  imdbId?: string;
}
