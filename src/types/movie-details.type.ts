import type { MovieDto } from "./movies-response.type";

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logoPath: string | null;
  name: string;
  originCountry: string;
}

export interface ProductionCountry {
  iso31661: string;
  name: string;
}

export interface SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;
}

export interface MovieDetailsDto extends Omit<MovieDto, "genreIds"> {
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdbId: string | null;
  productionCompanies: ProductionCompany[] | null;
  productionCountries: ProductionCountry[] | null;
  revenue: number;
  runtime: number | null;
  spokenLanguages: SpokenLanguage[] | null;
  status: string;
  tagline: string | null;
}
