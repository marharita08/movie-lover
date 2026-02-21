import { MediaType } from "@/const";

export type GetMediaTypeStatsResponse = {
  [key in MediaType]: number;
};
