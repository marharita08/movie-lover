import type {
  DiscoverMoviesQuery,
  MovieDetailsDto,
  MoviesResponseDto,
  MultiSearchQuery,
  MultiSearchResponseItem,
  PaginatedResponse,
  TVShowResponse,
} from "@/types";
import type { BaseQuery } from "@/types/base-query";
import type { PersonResponseDto } from "@/types/person-response.type";

import { httpService } from "../http/http.service";

export class TMDBService {
  async getDiscoverMovies(query: DiscoverMoviesQuery) {
    return httpService.get<MoviesResponseDto>("/tmdb/discover/movie", query);
  }

  async getMovie(id: string, query: BaseQuery) {
    return httpService.get<MovieDetailsDto>(`/tmdb/movie/${id}`, query);
  }

  async getTVShow(id: string, query: BaseQuery) {
    return httpService.get<TVShowResponse>(`/tmdb/tv/${id}`, query);
  }

  async getPerson(id: string, query: BaseQuery) {
    return httpService.get<PersonResponseDto>(`/tmdb/person/${id}`, query);
  }

  async multiSearch(query: MultiSearchQuery) {
    return httpService.get<PaginatedResponse<MultiSearchResponseItem>>(
      "/tmdb/search/multi",
      query,
    );
  }
}

export const tmdbService = new TMDBService();
