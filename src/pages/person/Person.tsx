import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, ErrorState, LoadingOverlay } from "@/components";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { ImdbUrl, TMDBImageUrl } from "@/const";
import { usePerson } from "@/hooks";
import { formatDate } from "@/utils";

export const Person = () => {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading, error, refetch } = usePerson(id!);
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error || !person) {
    return (
      <ErrorState
        title="Person not found"
        description={`We couldn't load this person's details. The reel might be missing or damaged.`}
        error={error}
        onRetry={() => refetch()}
        type="generic"
      />
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-(--spacing(22)))] w-full items-center justify-center p-4 md:p-10">
      <div className="bg-card/80 relative z-10 rounded-md p-4">
        <Button
          variant="ghost"
          className="mb-4 p-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex shrink-0 justify-center">
            {person.profilePath ? (
              <img
                src={`${TMDBImageUrl.ORIGINAL}${person.profilePath}`}
                alt={person.name}
                className="h-fit w-64 rounded-lg shadow-lg"
              />
            ) : (
              <div className="bg-muted flex h-96 w-64 items-center justify-center rounded-lg shadow-lg">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{person.name}</h1>
            {person.biography && (
              <ExpandableText
                className="text-muted-foreground text-sm"
                text={person.biography}
              />
            )}
            {(!!person.birthday ||
              !!person.deathday ||
              !!person.placeOfBirth) && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {person.birthday && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      Birthday
                    </span>
                    <span>{formatDate(person.birthday)}</span>
                  </div>
                )}
                {person.deathday && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      Deathday
                    </span>
                    <span>{formatDate(person.deathday)}</span>
                  </div>
                )}
                {person.placeOfBirth && (
                  <div>
                    <span className="text-muted-foreground block text-sm font-medium">
                      Place of Birth
                    </span>
                    <span>{person.placeOfBirth}</span>
                  </div>
                )}
              </div>
            )}
            {person.imdbId && (
              <Button asChild variant="link" className="px-0">
                <a
                  href={`${ImdbUrl.PERSON}${person.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in IMDB
                </a>
              </Button>
            )}
            {!person.biography &&
              !person.birthday &&
              !person.deathday &&
              !person.placeOfBirth &&
              !person.imdbId && (
                <div className="text-muted-foreground text-sm">
                  TMDB does not provide any additional information about this
                  person.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
