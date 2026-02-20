import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button, ErrorState, LoadingOverlay } from "@/components";
import { ImdbUrl, MediaType, mediaTypeToLabel, TMDBImageUrl } from "@/const";
import type { MovieDetailsDto, TVShowResponse } from "@/types";
import { formatDate, formatRuntime } from "@/utils";

interface MediaDetailsProps {
  media?: MovieDetailsDto | TVShowResponse | null;
  type: MediaType;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export const MediaDetails: React.FC<MediaDetailsProps> = ({
  media,
  type,
  isLoading,
  error,
  refetch,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error || !media) {
    return (
      <ErrorState
        title="Movie not found"
        description={`We couldn't load this ${mediaTypeToLabel[type]}'s details. The reel might be missing or damaged.`}
        error={error}
        onRetry={() => refetch()}
        type="generic"
      />
    );
  }

  const mediaTitle = "title" in media ? media.title : media.name;

  return (
    <div className="relative flex min-h-[calc(100vh-(--spacing(22)))] w-full items-center justify-center p-4 md:p-10">
      <div
        className="absolute inset-0 z-0 md:rounded-tl-md"
        style={{
          backgroundImage: media.backdropPath
            ? `url(${TMDBImageUrl.ORIGINAL}${media.backdropPath})`
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
            {media.posterPath ? (
              <img
                src={`${TMDBImageUrl.ORIGINAL}${media.posterPath}`}
                alt={mediaTitle}
                className="h-fit w-64 rounded-lg shadow-lg"
              />
            ) : (
              <div className="bg-muted flex h-96 w-64 items-center justify-center rounded-lg shadow-lg">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{mediaTitle}</h1>
            {media.tagline && (
              <p className="text-muted-foreground text-xl italic">
                {media.tagline}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {media.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-background text-primary-600 border-primary-600 rounded-full border px-3 py-1 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="text-lg">{media.overview}</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {"releaseDate" in media && media.releaseDate && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Release Date
                  </span>
                  <span>{formatDate(media.releaseDate)}</span>
                </div>
              )}
              {"runtime" in media && !!media.runtime && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Runtime
                  </span>
                  <span>{formatRuntime(media.runtime)}</span>
                </div>
              )}
              {"numberOfSeasons" in media && !!media.numberOfSeasons && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Number of Seasons
                  </span>
                  <span>{media.numberOfSeasons}</span>
                </div>
              )}
              {"numberOfEpisodes" in media && !!media.numberOfEpisodes && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Number of Episodes
                  </span>
                  <span>{media.numberOfEpisodes}</span>
                </div>
              )}
              {"firstAirDate" in media && media.firstAirDate && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    First Air Date
                  </span>
                  <span>{formatDate(media.firstAirDate)}</span>
                </div>
              )}
              {"lastAirDate" in media && media.lastAirDate && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Last Air Date
                  </span>
                  <span>{formatDate(media.lastAirDate)}</span>
                </div>
              )}
              {!!media.voteAverage && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    Vote Average
                  </span>
                  <span>{media.voteAverage.toFixed(1)}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground block text-sm font-medium">
                  Status
                </span>
                <span>{media.status}</span>
              </div>
            </div>

            {media.productionCountries.length > 0 && (
              <div>
                <h2 className="text-base font-semibold">
                  Production Countries
                </h2>
                <div>
                  {media.productionCountries
                    .map((country) => country.name)
                    .join(", ")}
                </div>
              </div>
            )}
            {media.imdbId && (
              <div>
                <h2 className="text-base font-semibold">IMDb</h2>
                <a
                  href={`${ImdbUrl.MEDIA}${media.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {`${ImdbUrl.MEDIA}${media.imdbId}`}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
