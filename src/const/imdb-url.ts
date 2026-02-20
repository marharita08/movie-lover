const imdbBaseUrl = import.meta.env.VITE_IMDB_BASE_URL;

export const ImdbUrl = {
  PERSON: `${imdbBaseUrl}name/`,
  MEDIA: `${imdbBaseUrl}title/`,
};
