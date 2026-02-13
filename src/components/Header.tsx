import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { RouterKey } from "@/const";
import { useCurrentUser, useLogout } from "@/hooks";

import { Avatar, AvatarFallback } from "./ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui";

export const Header = () => {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const userName = useMemo(
    () =>
      user?.name
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .join(""),
    [user?.name],
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfile = () => {
    navigate(RouterKey.USER_PROFILE);
  };

  return (
    <header className="bg-background fixed top-0 right-0 z-20 flex w-full items-center justify-between py-6 pr-4 pl-14">
      <h1 className="text-2xl font-bold">Movie Lover</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{userName}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block">{user?.email}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
