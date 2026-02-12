import type { MovieDto } from "@/types";

const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

interface MovieCardProps {
  movie: MovieDto;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-card shrink-0 overflow-hidden rounded-md shadow-md">
      <img src={`${imageBaseUrl}${movie.posterPath}`} alt={movie.title} />
      <div className="truncate p-2 text-sm font-medium">{movie.title}</div>
    </div>
  );
};
