import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { RouterKey, TranslationKey } from "@/const";
import { useLogout, useTranslation } from "@/hooks";
import type { User } from "@/types";
import { getFallback } from "@/utils";

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui";

interface HeaderMenuProps {
  user: User;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ user }) => {
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userName = useMemo(() => getFallback(user?.name), [user?.name]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfile = () => {
    navigate(RouterKey.USER_PROFILE);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
          <span className="hidden md:block">{user.email}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleProfile}>
          {t(TranslationKey.COMMON_PROFILE)}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {t(TranslationKey.COMMON_LOGOUT)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
