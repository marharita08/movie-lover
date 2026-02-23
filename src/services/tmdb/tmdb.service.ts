import type {
  DiscoverMoviesQuery,
  MovieDetailsDto,
  MoviesResponseDto,
  TVShowResponse,
} from "@/types";

import { httpService } from "../http/http.service";

export class TMDBService {
  async getDiscoverMovies(query: DiscoverMoviesQuery) {
    return httpService.get<MoviesResponseDto>("/tmdb/discover/movie", query);
  }

  async getMovie(id: string) {
    return httpService.get<MovieDetailsDto>(`/tmdb/movie/${id}`);
  }

  async getTVShow(id: string) {
    return httpService.get<TVShowResponse>(`/tmdb/tv/${id}`);
  }
}

export const tmdbService = new TMDBService();
