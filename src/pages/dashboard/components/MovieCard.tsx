import { generatePath, Link } from "react-router-dom";

import { RouterKey } from "@/const";
import type { MovieDto } from "@/types";

const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

interface MovieCardProps {
  movie: MovieDto;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link
      to={generatePath(RouterKey.MOVIE_DETAILS, { id: movie.id.toString() })}
    >
      <div className="bg-card shrink-0 overflow-hidden rounded-md shadow-md transition-transform hover:scale-105">
        {movie.posterPath ? (
          <img src={`${imageBaseUrl}${movie.posterPath}`} alt={movie.title} />
        ) : (
          <div className="bg-muted flex h-[300px] w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        <div className="truncate p-2 text-sm font-medium">{movie.title}</div>
      </div>
    </Link>
  );
};
