import "swiper/css";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { EmptyState, ErrorState, Loading } from "@/components";
import type { ShortMedia } from "@/types";
import { cn } from "@/utils";

import { MediaCard } from "../media-card/MediaCard";

interface MediaListProps {
  medias: ShortMedia[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
}

export const MediaList: React.FC<MediaListProps> = ({
  medias,
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
}) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const isEmpty = !isLoading && !isError && !medias?.length;

  if (isEmpty) {
    return (
      <EmptyState
        title="No medias found"
        description="We couldn't find any medias matching your criteria."
        icon="film"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load medias"
        description="We're having trouble fetching medias right now. Please try again."
        error={error}
        onRetry={() => refetch()}
        type="server"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const handleSlideChange = (swiper: SwiperType) => {
    const slidesPerView = typeof swiper.params.slidesPerView === 'number' 
      ? swiper.params.slidesPerView 
      : 1;
    
    const slidesPerGroup = swiper.params.slidesPerGroup || 1;
    const threshold = slidesPerGroup * 2;
    const remainingSlides = medias.length - (swiper.activeIndex + slidesPerView);
    
    if (remainingSlides <= threshold && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="relative sm:px-6">
      <button
        ref={prevRef}
        className={cn(
          "hover:text-primary bg-card absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 shadow-md sm:flex",
          isLocked && "sm:hidden",
        )}
        aria-label="Previous"
      >
        <ChevronLeftIcon />
      </button>

      <button
        ref={nextRef}
        className={cn(
          "hover:text-primary bg-card absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 shadow-md sm:flex",
          isLocked && "sm:hidden",
        )}
        aria-label="Next"
      >
        <ChevronRightIcon />
      </button>

      <Swiper
        modules={[Navigation, Virtual]}
        spaceBetween={16}
        virtual={{
          enabled: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          480: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerView: 6,
            slidesPerGroup: 3,
          },
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation!.prevEl = prevRef.current;
            swiper.params.navigation!.nextEl = nextRef.current;
          }
        }}
        onSlideChange={handleSlideChange}
        watchOverflow
        onLock={() => setIsLocked(true)}
        onUnlock={() => setIsLocked(false)}
      >
        {medias.map((media, index) => (
          <SwiperSlide key={media.id} virtualIndex={index}>
            <MediaCard media={media} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
