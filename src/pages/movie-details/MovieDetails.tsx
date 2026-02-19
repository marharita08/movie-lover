import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AuthenticatedLayout,
  Button,
  ErrorState,
  LoadingOverlay,
} from "@/components";
import { ImdbUrl } from "@/const/imdb-url";
import { useMovie } from "@/hooks/queries/useMovie";
import { formatDate, formatRuntime } from "@/utils";

const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading, error, refetch } = useMovie(id);

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <LoadingOverlay />
      </AuthenticatedLayout>
    );
  }

  if (error || !movie) {
    return (
      <AuthenticatedLayout>
        <ErrorState
          title="Movie not found"
          description="We couldn't load this movie's details. The reel might be missing or damaged."
          onRetry={() => refetch()}
          type="generic"
        />
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="relative flex min-h-[calc(100vh-(--spacing(22)))] w-full items-center justify-center p-4 md:p-10">
        <div
          className="absolute inset-0 z-0 md:rounded-tl-md"
          style={{
            backgroundImage: movie.backdropPath
              ? `url(${imageBaseUrl}${movie.backdropPath})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="bg-card/80 relative z-10 rounded-md p-4">
          <Button
            variant="ghost"
            className="mb-4 p-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex shrink-0 justify-center">
              {movie.posterPath ? (
                <img
                  src={`${imageBaseUrl}${movie.posterPath}`}
                  alt={movie.title}
                  className="w-64 rounded-lg shadow-lg"
                />
              ) : (
                <div className="bg-muted flex h-96 w-64 items-center justify-center rounded-lg shadow-lg">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-muted-foreground text-xl italic">
                  {movie.tagline}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-background text-primary-600 border-primary-600 rounded-full border px-3 py-1 text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-lg">{movie.overview}</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {movie.releaseDate && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      Release Date
                    </span>
                    <span>{formatDate(movie.releaseDate)}</span>
                  </div>
                )}
                {!!movie.runtime && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      Runtime
                    </span>
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                {!!movie.voteAverage && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      Vote Average
                    </span>
                    <span>{movie.voteAverage.toFixed(1)}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Status
                  </span>
                  <span>{movie.status}</span>
                </div>
              </div>

              {movie.productionCountries.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold">
                    Production Countries
                  </h2>
                  <div>
                    {movie.productionCountries
                      .map((country) => country.name)
                      .join(", ")}
                  </div>
                </div>
              )}
              {movie.imdbId && (
                <div>
                  <h2 className="text-base font-semibold">IMDb</h2>
                  <a
                    href={`${ImdbUrl.MOVIE}${movie.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {`${ImdbUrl.MOVIE}${movie.imdbId}`}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
