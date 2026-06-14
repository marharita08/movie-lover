import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button, ErrorState, LoadingOverlay, PosterImage } from "@/components";
import {
  ImdbUrl,
  MediaType,
  mediaTypeToLabel,
  TMDBImageUrl,
  TranslationKey,
} from "@/const";
import { useTranslation } from "@/hooks";
import type { MovieDetailsDto, TVShowResponse } from "@/types";
import { cn, formatDate, formatRuntime } from "@/utils";

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
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error || !media) {
    return (
      <ErrorState
        title={t(TranslationKey.MEDIA_DETAILS_NOT_FOUND)}
        description={t(TranslationKey.MEDIA_DETAILS_LOAD_FAILED).replace(
          "{{type}}",
          mediaTypeToLabel[type],
        )}
        error={error}
        onRetry={() => refetch()}
        type="generic"
      />
    );
  }

  const mediaTitle = "title" in media ? media.title : media.name;
  const originalTitle =
    "originalTitle" in media ? media.originalTitle : media.originalName;

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
          <span data-testid="back-btn">
            {t(TranslationKey.MEDIA_DETAILS_BACK)}
          </span>
        </Button>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex h-fit shrink-0 justify-center">
            <PosterImage
              path={media.posterPath}
              alt={mediaTitle}
              className="w-64 rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">
              <span data-testid="media-title">{mediaTitle}</span>{" "}
              {originalTitle !== mediaTitle && (
                <span data-testid="media-original">({originalTitle})</span>
              )}
            </h1>
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
                    {t(TranslationKey.MEDIA_DETAILS_RELEASE_DATE)}
                  </span>
                  <span data-testid="media-release-date">
                    {formatDate(media.releaseDate)}
                  </span>
                </div>
              )}
              {"runtime" in media && !!media.runtime && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_RUNTIME)}
                  </span>
                  <span data-testid="media-runtime">
                    {formatRuntime(media.runtime)}
                  </span>
                </div>
              )}
              {"numberOfSeasons" in media && !!media.numberOfSeasons && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_SEASONS)}
                  </span>
                  <span data-testid="media-seasons">
                    {media.numberOfSeasons}
                  </span>
                </div>
              )}
              {"numberOfEpisodes" in media && !!media.numberOfEpisodes && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_EPISODES)}
                  </span>
                  <span data-testid="media-episodes">
                    {media.numberOfEpisodes}
                  </span>
                </div>
              )}
              {"firstAirDate" in media && media.firstAirDate && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_FIRST_AIR)}
                  </span>
                  <span>{formatDate(media.firstAirDate)}</span>
                </div>
              )}
              {"lastAirDate" in media && media.lastAirDate && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_LAST_AIR)}
                  </span>
                  <span>{formatDate(media.lastAirDate)}</span>
                </div>
              )}
              {"nextEpisodeToAir" in media &&
                media.nextEpisodeToAir &&
                media.nextEpisodeToAir.airDate && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      {t(TranslationKey.MEDIA_DETAILS_NEXT_AIR)}
                    </span>
                    <span>{formatDate(media.nextEpisodeToAir.airDate)}</span>
                  </div>
                )}
              {!!media.voteAverage && (
                <div>
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_VOTE_AVG)}
                  </span>
                  <span>{media.voteAverage.toFixed(1)}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground block text-sm font-medium">
                  {t(TranslationKey.MEDIA_DETAILS_STATUS)}
                </span>
                <span>{media.status}</span>
              </div>
              {media.productionCountries.length > 0 && (
                <div
                  className={cn(
                    "col-span-2 md:col-span-1",
                    media.productionCountries.length > 3 && "md:col-span-2",
                  )}
                >
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_COUNTRIES)}
                  </span>
                  <div>
                    {media.productionCountries
                      .map((country) => country.name)
                      .join(", ")}
                  </div>
                </div>
              )}
              {media.productionCompanies.length > 0 && (
                <div
                  className={cn(
                    "col-span-2 md:col-span-1",
                    media.productionCompanies.length > 3 && "md:col-span-2",
                  )}
                >
                  <span className="text-muted-foreground block text-sm font-medium">
                    {t(TranslationKey.MEDIA_DETAILS_COMPANIES)}
                  </span>
                  <div>
                    {media.productionCompanies
                      .map((company) => company.name)
                      .join(", ")}
                  </div>
                </div>
              )}
            </div>

            {media.imdbId && (
              <Button asChild variant="link" className="p-0">
                <a
                  href={`${ImdbUrl.MEDIA}${media.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(TranslationKey.MEDIA_DETAILS_OPEN_IMDB)}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
