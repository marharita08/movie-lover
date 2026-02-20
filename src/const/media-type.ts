export const MediaType = {
  MOVIE: "movie",
  TV: "tv",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const mediaTypeToLabel = {
  [MediaType.MOVIE]: "Movie",
  [MediaType.TV]: "TV Show",
} as const;
