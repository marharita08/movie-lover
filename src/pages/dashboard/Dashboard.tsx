import { InfoIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { useCurrentUser, useScrollRestoration } from "@/hooks";

import { DiscoverMovies } from "./components";

export const Dashboard = () => {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const currentYear = new Date().getFullYear();
  const lastThreeYears = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const [readySections, setReadySections] = useState<Set<number>>(new Set());

  const markReady = useCallback((section: number) => {
    setReadySections((prev) => new Set(prev).add(section));
  }, []);

  const isReady = lastThreeYears.length === readySections.size;

  useScrollRestoration(isReady);

  return (
    <div className="flex flex-col gap-15 px-2 pt-8 pb-15 md:pr-4 md:pl-0 lg:pr-12 lg:pl-8">
      {!isUserLoading && !user && (
        <div className="bg-primary/10 flex flex-1 items-center gap-4 rounded-md px-4 py-3">
          <div
            className={
              "bg-primary text-primary-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            }
          >
            <InfoIcon className="h-5 w-5" />
          </div>
          <div>
            Log in or sign up to view statistics for your IMDb lists and access
            the AI chat.
          </div>
        </div>
      )}
      {lastThreeYears.map((year) => (
        <section key={year} className="flex flex-col gap-4">
          <h2 className="pl-8 text-2xl font-bold">{year}</h2>
          <DiscoverMovies
            query={{ primaryReleaseYear: year, sortBy: "vote_count.desc" }}
            onReady={markReady}
          />
        </section>
      ))}
    </div>
  );
};
