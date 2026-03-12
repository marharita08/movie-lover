export const ListSection = {
  MEDIAS: "medias",
  UPCOMING_TV_SHOWS: "upcomingTvShows",
  AMOUNT_STATS: "amountStats",
  GENRES: "genres",
  MEDIA_TYPE: "mediaType",
  RATING: "rating",
  YEARS: "years",
  COMPANIES: "companies",
  COUNTRIES: "countries",
  PERSONS_ACTORS: "personsActors",
  PERSONS_DIRECTORS: "personsDirectors",
} as const;

export type ListSection = (typeof ListSection)[keyof typeof ListSection];
