import { ImageOffIcon } from "lucide-react";

import { TMDBImageUrl } from "@/const";
import { cn } from "@/utils";

interface PosterImageProps {
  alt: string;
  path: string | null;
  className?: string;
}

export const PosterImage: React.FC<PosterImageProps> = ({
  alt,
  path,
  className,
}) => {
  return (
    <div
      className={cn("bg-muted aspect-2/3 w-full overflow-hidden", className)}
    >
      {path ? (
        <img
          src={`${TMDBImageUrl.W342}${path}`}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          aria-label={`${alt} image`}
        />
      ) : (
        <div
          className="flex h-full items-center justify-center"
          aria-label={`${alt} image`}
        >
          <ImageOffIcon className="text-muted-foreground h-12 w-12" />
        </div>
      )}
    </div>
  );
};
