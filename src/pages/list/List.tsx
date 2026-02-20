import { PersonRole } from "@/const/person-role";

import { GenresAnalytics } from "./components/GenresAnalytics";
import { MediasFromList } from "./components/MediasFromList";
import { PersonsAnalytics } from "./components/PersonsAnalytics";

export const List = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="px-2 text-2xl font-bold md:px-0">List</h2>
        <MediasFromList />
      </div>
      <div>
        <h2 className="px-2 text-2xl font-bold md:px-0">Analitics</h2>
        <div className="flex flex-col gap-8 px-0 py-2">
          <GenresAnalytics />
          <PersonsAnalytics role={PersonRole.ACTOR} />
          <PersonsAnalytics role={PersonRole.DIRECTOR} />
        </div>
      </div>
    </div>
  );
};
