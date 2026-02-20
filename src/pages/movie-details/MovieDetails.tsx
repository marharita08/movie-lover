import { useParams } from "react-router-dom";

import { MediaType } from "@/const";
import { useMovie } from "@/hooks/queries/useMovie";

import { MediaDetails } from "./components/MediaDetails";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading, error, refetch } = useMovie(id);

  return (
    <MediaDetails
      media={movie}
      type={MediaType.MOVIE}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
    />
  );
};
