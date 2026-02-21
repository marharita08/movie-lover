import { useParams } from "react-router-dom";

import { MediaDetails } from "@/components";
import { MediaType } from "@/const";
import { useTVShow } from "@/hooks";

export const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tvShow, isLoading, error, refetch } = useTVShow(id);

  return (
    <MediaDetails
      media={tvShow}
      type={MediaType.TV}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
    />
  );
};
