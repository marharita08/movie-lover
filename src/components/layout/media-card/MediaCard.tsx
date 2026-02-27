import { useMemo } from "react";
import { generatePath, Link } from "react-router-dom";

import { ImdbUrl, MediaType, RouterKey, TMDBImageUrl } from "@/const";
import type { ShortMedia } from "@/types";

interface MediaCardProps {
  media: ShortMedia;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const CardContent = useMemo(() => {
    return (
      <div className="bg-card flex shrink-0 flex-col overflow-hidden rounded-md shadow-md">
        {media.posterPath ? (
          <img
            src={`${TMDBImageUrl.ORIGINAL}${media.posterPath}`}
            alt={media.title}
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex aspect-2/3 w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        <div className="flex-1 truncate p-2 text-sm font-medium">
          {media.title}
        </div>
      </div>
    );
  }, [media.title, media.posterPath]);

  return media.id ? (
    <Link
      to={generatePath(
        media.type === MediaType.MOVIE
          ? RouterKey.MOVIE_DETAILS
          : RouterKey.TV_SHOW_DETAILS,
        { id: media.id.toString() },
      )}
    >
      {CardContent}
    </Link>
  ) : media.imdbId ? (
    <a
      href={`${ImdbUrl.MEDIA}${media.imdbId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {CardContent}
    </a>
  ) : (
    CardContent
  );
};
