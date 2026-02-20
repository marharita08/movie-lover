import "swiper/css";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { EmptyState, ErrorState, Loading } from "@/components";
import type { ShortMedia } from "@/types";

import { MediaCard } from "../../dashboard/components/MediaCard";

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

  const isEmpty = !isLoading && !isError && !medias?.length;

  if (isEmpty) {
    return (
      <EmptyState
        title="No medias found"
        description="We couldn't find any medias matching your criteria. Try exploring different years or genres."
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

  return (
    <div className="relative sm:px-6">
      <button
        ref={prevRef}
        className="hover:text-primary bg-card absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 shadow-md sm:flex"
      >
        <ChevronLeftIcon />
      </button>

      <button
        ref={nextRef}
        className="hover:text-primary bg-card absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 shadow-md sm:flex"
      >
        <ChevronRightIcon />
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
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
        onReachEnd={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      >
        {medias.map((media) => (
          <SwiperSlide key={media.id}>
            <MediaCard media={media} />
          </SwiperSlide>
        ))}

        {isFetchingNextPage && (
          <SwiperSlide>
            <Loading />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};
