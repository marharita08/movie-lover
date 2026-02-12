import "swiper/css";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Loading } from "@/components";
import { useDiscoverMovies } from "@/hooks/queries/useDiscoverMovies";
import type { DiscoverMoviesQuery } from "@/types";

import { MovieCard } from "./MovieCard";

interface MovieListProps {
  query: DiscoverMoviesQuery;
}

export const MovieList: React.FC<MovieListProps> = ({ query }) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverMovies(query);
  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const isEmpty = !isLoading && !isError && !movies?.length;

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-error">No movies found</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-error">Something went wrong</p>
      </div>
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
    <div className="relative px-6">
      <button
        ref={prevRef}
        className="hover:text-primary bg-card absolute top-1/2 left-0 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 shadow-md"
      >
        <ChevronLeftIcon />
      </button>

      <button
        ref={nextRef}
        className="hover:text-primary bg-card absolute top-1/2 right-0 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 shadow-md"
      >
        <ChevronRightIcon />
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={6}
        slidesPerGroup={3}
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
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
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
