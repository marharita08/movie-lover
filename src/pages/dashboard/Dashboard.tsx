import { InfoIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components";
import { ImdbUrl, RouterKey } from "@/const";
import { useCurrentUser, useScrollRestoration } from "@/hooks";

import { DiscoverMovies, HowItWorksCard } from "./components";

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

  const isNotAuthenticated = !isUserLoading && !user;

  return (
    <div className="flex flex-col gap-15 px-2 pt-8 pb-15 md:pr-4 md:pl-0 lg:pr-12 lg:pl-8">
      {isNotAuthenticated && (
        <div className="bg-primary/10 flex flex-1 items-center gap-4 rounded-md px-4 py-3">
          <div
            className={
              "bg-primary text-primary-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            }
          >
            <InfoIcon className="h-5 w-5" />
          </div>
          <div>
            <Button variant="link" asChild className="p-0">
              <Link to={RouterKey.LOGIN}>Log in</Link>
            </Button>{" "}
            or{" "}
            <Button variant="link" asChild className="p-0">
              <Link to={RouterKey.SIGNUP}>sign up</Link>
            </Button>{" "}
            to view statistics for your IMDb lists and access the AI chat.
          </div>
        </div>
      )}
      <div className="mx-auto px-4">
        <h2 className="mb-2 text-2xl font-semibold">How it works</h2>
        <p className="text-muted-foreground mb-6">
          Turn your IMDb lists into insights and personalized recommendations.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a href={ImdbUrl.BASE} target="_blank" rel="noopener noreferrer">
            <HowItWorksCard
              step={1}
              title="Export your IMDb list"
              description="Download your IMDb list as a CSV file (rated titles are recommended for better insights)."
            />
          </a>
          <Link
            to={isNotAuthenticated ? RouterKey.LOGIN : RouterKey.CREATE_LIST}
          >
            <HowItWorksCard
              step={2}
              title="Upload your list"
              description="Upload your CSV file here to create your personal movie profile. You can upload multiple IMDb lists (watchlist, rated, or custom lists)."
            />
          </Link>
          <Link to={isNotAuthenticated ? RouterKey.LOGIN : RouterKey.LISTS}>
            <HowItWorksCard
              step={3}
              title="Explore your statistics"
              description="Discover your movie taste through statistics and insights."
            />
          </Link>
          <Link to={isNotAuthenticated ? RouterKey.LOGIN : RouterKey.CHAT}>
            <HowItWorksCard
              step={4}
              title="Get AI recommendations"
              description="Chat with AI to receive personalized movie and TV show recommendations based on your lists."
            />
          </Link>
        </div>
      </div>
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
