import { Link } from "react-router-dom";

import { RouterKey } from "@/const";
import { useCurrentUser } from "@/hooks";

import { Button, Loading } from "../../ui";
import { HeaderMenu } from "../header-menu/HeaderMenu";

export const Header = () => {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <header className="bg-background fixed top-0 right-0 z-20 flex w-full items-center justify-end py-6 pr-4 pl-14 md:justify-between">
      <Link to={RouterKey.DASHBOARD}>
        <div className="flex items-center gap-1">
          <img src="/movie-tape.png" alt="Logo" className="h-10 w-10" />
          <h1 className="hidden text-2xl font-bold md:block">Movie Lover</h1>
        </div>
      </Link>
      {isLoading && <Loading data-testid="loading" />}
      {!isLoading && user && <HeaderMenu user={user} />}
      {!isLoading && !user && (
        <div className="flex items-center gap-2">
          <Button asChild variant={"link"}>
            <Link to={RouterKey.LOGIN}>Login</Link>
          </Button>
          <Button asChild variant={"link"}>
            <Link to={RouterKey.SIGNUP}>Sign Up</Link>
          </Button>
        </div>
      )}
    </header>
  );
};
