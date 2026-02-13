import type {
  DiscoverMoviesQuery,
  MovieDetailsDto,
  MoviesResponseDto,
} from "@/types";

import { httpService } from "./http.service";

class TMDBService {
  async getDiscoverMovies(query: DiscoverMoviesQuery) {
    return await httpService.get<MoviesResponseDto>(
      "/tmdb/discover/movie",
      query,
    );
  }

  async getMovie(id: string) {
    return await httpService.get<MovieDetailsDto>(`/tmdb/movie/${id}`);
  }
}

export const tmdbService = new TMDBService();
