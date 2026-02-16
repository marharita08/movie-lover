import type { PaginatedResponse } from "./paginated-response.type";

export interface MovieDto {
  adult: boolean;
  backdropPath: string | null;
  genreIds: number[];
  id: number;
  imdbId: string | null;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string | null;
  releaseDate: string | null;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

export type MoviesResponseDto = PaginatedResponse<MovieDto>;
