import { AuthenticatedLayout } from "@/components";

import { MovieList } from "./components/MovieList";

export const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const lastThreeYears = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-15 px-2 pt-8 pb-15 md:pr-4 md:pl-0 lg:pr-12 lg:pl-8">
        {lastThreeYears.map((year) => (
          <div key={year} className="flex flex-col gap-4">
            <h2 className="pl-8 text-2xl font-bold">{year}</h2>
            <MovieList
              query={{ primaryReleaseYear: year, sortBy: "vote_count.desc" }}
            />
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
};
