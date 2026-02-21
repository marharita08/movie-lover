import { generatePath, Link } from "react-router-dom";

import { MediaType, RouterKey, TMDBImageUrl } from "@/const";
import type { ShortMedia } from "@/types";

interface MediaCardProps {
  media: ShortMedia;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  return (
    <Link
      to={generatePath(
        media.type === MediaType.MOVIE
          ? RouterKey.MOVIE_DETAILS
          : RouterKey.TV_SHOW_DETAILS,
        { id: media.id.toString() },
      )}
    >
      <div className="bg-card flex shrink-0 flex-col overflow-hidden rounded-md shadow-md">
        {media.posterPath ? (
          <img
            src={`${TMDBImageUrl.ORIGINAL}${media.posterPath}`}
            alt={media.title}
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex h-[300px] w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        <div className="flex-1 truncate p-2 text-sm font-medium">
          {media.title}
        </div>
      </div>
    </Link>
  );
};
