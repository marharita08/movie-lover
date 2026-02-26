import { Separator } from "@/components";
import { PersonRole } from "@/const";

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

export const List = () => {
  return (
    <div className="flex flex-col gap-15">
      <section className="flex flex-col gap-4">
        <h2 className="mb-4 px-2 text-2xl font-bold md:px-0">List</h2>
        <MediasFromList />
      </section>
      <Separator />
      <UpcomingTVShows />
      <Separator />
      <section>
        <h2 className="mb-4 px-2 text-2xl font-bold md:px-0">Analitics</h2>
        <div className="flex flex-col gap-12 px-0 py-2">
          <AmountStats />
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
            <GenresAnalytics />
            <MediaTypeAnalytics />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
            <RatingAnalytics />
            <YearsAnalytics />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-2">
            <CompaniesAnalytics />
            <CountriesAnalytics />
          </div>
          <PersonsAnalytics role={PersonRole.ACTOR} />
          <Separator />
          <PersonsAnalytics role={PersonRole.DIRECTOR} />
        </div>
      </section>
    </div>
  );
};
