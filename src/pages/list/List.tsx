import { AuthenticatedLayout } from "@/components";
import { PersonRole } from "@/const/person-role";

import { GenresAnalitics } from "./components/GenresAnalitics";
import { PersonsAnalitics } from "./components/PersonsAnalitics";

export const List = () => {
  return (
    <AuthenticatedLayout>
      <div>
        <h2 className="px-2 text-2xl font-bold md:px-0">Analitics</h2>
        <div className="flex flex-col gap-8 px-0 py-2">
          <GenresAnalitics />
          <PersonsAnalitics role={PersonRole.ACTOR} />
          <PersonsAnalitics role={PersonRole.DIRECTOR} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
