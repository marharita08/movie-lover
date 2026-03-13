import { useCallback, useRef, useState } from "react";

import { Separator } from "@/components";
import { PersonRole } from "@/const";
import { useScrollRestoration } from "@/hooks";

import {
  AmountStats,
  CompaniesAnalytics,
  CountriesAnalytics,
  GenresAnalytics,
  MediasFromList,
  MediaTypeAnalytics,
  PersonsAnalytics,
  RatingAnalytics,
  UpcomingTVShows,
  YearsAnalytics,
} from "./components";
import { ListSection } from "./const";

const ALL_SECTIONS = new Set(Object.values(ListSection));

export const List = () => {
  const readySectionsRef = useRef<Set<ListSection>>(new Set());
  const [isReady, setIsReady] = useState(false);

  const markReady = useCallback((section: ListSection) => {
    readySectionsRef.current.add(section);
    if (readySectionsRef.current.size === ALL_SECTIONS.size) {
      setIsReady(true);
    }
  }, []);

  useScrollRestoration(isReady);

  return (
    <div className="flex flex-col gap-15">
      <MediasFromList onReady={markReady} />
      <UpcomingTVShows onReady={markReady} />
      <Separator />
      <section>
        <h2 className="mb-4 px-2 text-2xl font-bold md:px-0">Analitics</h2>
        <div className="flex flex-col gap-12 px-0 py-2">
          <AmountStats onReady={markReady} />
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
            <GenresAnalytics onReady={markReady} />
            <MediaTypeAnalytics onReady={markReady} />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
            <RatingAnalytics onReady={markReady} />
            <YearsAnalytics onReady={markReady} />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
            <CompaniesAnalytics onReady={markReady} />
            <CountriesAnalytics onReady={markReady} />
          </div>
          <Separator />
          <PersonsAnalytics role={PersonRole.ACTOR} onReady={markReady} />
          <Separator />
          <PersonsAnalytics role={PersonRole.DIRECTOR} onReady={markReady} />
        </div>
      </section>
    </div>
  );
};
