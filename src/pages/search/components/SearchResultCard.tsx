import { ImageOffIcon } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Separator } from "@/components";
import { TMDBImageUrl } from "@/const";
import { MultiSearchMediaType } from "@/const/multi-search-media-type";
import type {
  MovieDto,
  MultiSearchResponseItem,
  PersonResponseDto,
  TVShowResponse,
} from "@/types";

interface SearchResultCardProps {
  result: MultiSearchResponseItem;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
}) => {
  const details = useMemo(() => {
    if (result.mediaType === MultiSearchMediaType.MOVIE) {
      const parsedResult = result as MovieDto;
      return {
        to: `/movie/${result.id}`,
        title: parsedResult.title,
        imagePath: parsedResult.posterPath,
      };
    }
    if (result.mediaType === MultiSearchMediaType.TV) {
      const parsedResult = result as TVShowResponse;
      return {
        to: `/tv/${result.id}`,
        title: parsedResult.name,
        imagePath: parsedResult.posterPath,
      };
    }
    const parsedResult = result as PersonResponseDto;
    return {
      to: `/person/${result.id}`,
      title: parsedResult.name,
      imagePath: parsedResult.profilePath,
    };
  }, [result]);

  return (
    <Link to={details.to} className="hover:bg-primary/5 pt-2">
      <div className="mb-2 flex items-center gap-2 px-2">
        {details.imagePath ? (
          <img
            src={`${TMDBImageUrl.ORIGINAL}${details.imagePath}`}
            alt={details.title}
            className="aspect-2/3 w-20"
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex aspect-2/3 w-20 items-center justify-center">
            <ImageOffIcon className="text-muted-foreground h-6 w-6" />
          </div>
        )}
        <div className="font-medium">{details.title}</div>
      </div>
      <Separator />
    </Link>
  );
};
