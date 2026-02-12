import type { DiscoverMoviesQuery, MoviesResponseDto } from "@/types";

import { httpService } from "./http.service";

class TMDBService {
  async getDiscoverMovies(query: DiscoverMoviesQuery) {
    return await httpService.get<MoviesResponseDto>(
      "/tmdb/discover/movie",
      query,
    );
  }
}

export const tmdbService = new TMDBService();
