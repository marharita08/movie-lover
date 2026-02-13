import { HomeIcon, ListIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { RouterKey } from "@/const";

import { Button } from "./ui";

export const Sidebar = () => {
  const pathname = useLocation().pathname;

  return (
    <aside className="fixed top-0 left-0 z-20 hidden h-screen w-10 items-center justify-center rounded-r-xl md:flex">
      <div className="text-primary-foreground relative flex h-92/100">
        <div className="bg-primary-900 text-primary-foreground h-full w-7"></div>
        <div
          className="bg-primary-900 text-primary-foreground h-full w-3"
          style={{
            clipPath: "polygon(0% 0%, 100% 4%, 100% 96%, 0% 100%)",
          }}
        ></div>
        <nav className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1">
          <Button
            variant="nav"
            size="nav"
            asChild
            className={pathname === RouterKey.DASHBOARD ? "bg-primary" : ""}
          >
            <Link to={RouterKey.DASHBOARD}>
              <HomeIcon className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="nav"
            size="nav"
            asChild
            className={pathname === RouterKey.LISTS ? "bg-primary" : ""}
          >
            <Link to={RouterKey.LISTS}>
              <ListIcon className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </aside>
  );
};
