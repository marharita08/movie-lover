import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/DropdownMenu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { useMemo } from "react";
import { useLogout } from "@/hooks/useLogout";

export const Header = () => {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const userName = useMemo(() => user?.name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join(""), [user?.name]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="pl-14 pr-4 py-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Movie Lover</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{userName}</AvatarFallback>
            </Avatar>
            <span>{user?.email}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
