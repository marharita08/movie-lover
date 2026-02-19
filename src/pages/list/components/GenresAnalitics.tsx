import { useParams } from "react-router-dom";

import { useGenreStats } from "@/hooks";

import { GenresBarChart } from "./GenresBarChart";

export const GenresAnalitics = () => {
  const { id } = useParams<{ id: string }>();

  const { data: analitics } = useGenreStats(id!);

  const genres = Object.entries(analitics || {}).map(([key, value]) => ({
    genre: key,
    amount: value,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h3 className="px-2 text-lg font-bold">Genres</h3>
      <GenresBarChart data={genres} />
    </div>
  );
};
