import { HomeIcon, ListIcon, MenuIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { RouterKey } from "@/const";
import { cn } from "@/utils";

import { Button, Sheet, SheetContent, SheetTrigger } from "./ui";

const isActive = (item: (typeof navItems)[number], pathname: string) => {
  return item.activePath.some((path) => {
    if (path.includes(":")) {
      return pathname.startsWith(path.split(":")[0]);
    }
    return path === pathname;
  });
};

const navItems = [
  {
    to: RouterKey.DASHBOARD,
    icon: HomeIcon,
    label: "Dashboard",
    activePath: [RouterKey.DASHBOARD] as string[],
  },
  {
    to: RouterKey.LISTS,
    icon: ListIcon,
    label: "My Lists",
    activePath: [
      RouterKey.LISTS,
      RouterKey.CREATE_LIST,
      RouterKey.LIST,
      RouterKey.PERSONS_ANALYTICS,
    ] as string[],
  },
];

export const Sidebar = () => {
  const pathname = useLocation().pathname;

  return (
    <>
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
            {navItems.map((item) => (
              <Button
                variant="nav"
                size="nav"
                asChild
                className={isActive(item, pathname) ? "bg-primary" : ""}
                key={item.label}
              >
                <Link to={item.to}>
                  <item.icon className="h-5 w-5" />
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <div className="fixed top-5 left-2 z-20 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"}>
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <h2 className="mb-8 text-center text-xl font-bold">Menu</h2>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "justify-start",
                    isActive(item, pathname) ? "bg-accent" : "",
                  )}
                  key={item.label}
                >
                  <Link to={item.to}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
