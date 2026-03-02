export const MultiSearchMediaType = {
  MOVIE: "movie",
  TV: "tv",
  PERSON: "person",
} as const;

export type MultiSearchMediaType =
  (typeof MultiSearchMediaType)[keyof typeof MultiSearchMediaType];
