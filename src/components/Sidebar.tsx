import { HomeIcon, ListIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { Link, useLocation } from "react-router-dom";
import { RouterKey } from "@/const";

export const Sidebar = () => {
  const pathname = useLocation().pathname;

  return (
    <div className="w-10 h-screen rounded-r-xl absolute top-0 left-0 flex items-center justify-center">
      <div className="h-92/100 flex relative text-primary-foreground">
        <div className="h-full w-7 bg-primary-900 text-primary-foreground"></div>
        <div
          className="h-full w-3 bg-primary-900 text-primary-foreground"
          style={{
            clipPath: "polygon(0% 0%, 100% 4%, 100% 96%, 0% 100%)",
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
          <Button variant="nav" size="nav" asChild className={pathname === RouterKey.DASHBOARD ? "bg-primary" : ""}>
            <Link to={RouterKey.DASHBOARD}>
              <HomeIcon className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="nav" size="nav" asChild className={pathname === RouterKey.LISTS ? "bg-primary" : ""}>
            <Link to={RouterKey.LISTS}>
              <ListIcon className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
