import type { MultiSearchMediaType } from "../const/multi-search-media-type";
import type { MovieDto } from "./movies-response.type";
import type { PersonResponseDto } from "./person-response.type";
import type { TVShowResponse } from "./tv-show-response.type";

export type MultiSearchResponseItem = (
  | MovieDto
  | TVShowResponse
  | PersonResponseDto
) & {
  mediaType: MultiSearchMediaType;
};
