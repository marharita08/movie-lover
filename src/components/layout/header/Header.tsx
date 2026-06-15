import { Link } from "react-router-dom";

import { RouterKey, TranslationKey } from "@/const";
import { useCurrentUser, useTranslation } from "@/hooks";

import { Button, Loading } from "../../ui";
import { HeaderMenu } from "../header-menu/HeaderMenu";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <header className="bg-background fixed top-0 right-0 z-20 flex w-full items-center justify-between py-6 pr-4 pl-14">
      <Link to={RouterKey.DASHBOARD}>
        <div className="flex items-center gap-1">
          <img
            src="/movie-tape.png"
            alt="Logo"
            className="hidden h-10 w-10 md:block"
          />
          <h1
            className="text-xl font-bold md:text-2xl"
            data-testid="header-title"
          >
            Movie Lover
          </h1>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <LanguageSelector />

        {isLoading && <Loading data-testid="loading" />}

        {!isLoading && user && (
          <div data-testid="header-menu-wrapper">
            <HeaderMenu user={user} />
          </div>
        )}

        {!isLoading && !user && (
          <div className="flex items-center gap-2" data-testid="auth-links">
            <Button asChild variant="link">
              <Link to={RouterKey.LOGIN} data-testid="login-link">
                {t(TranslationKey.AUTH_LOGIN)}
              </Link>
            </Button>

            <Button asChild variant="link">
              <Link to={RouterKey.SIGNUP} data-testid="signup-link">
                {t(TranslationKey.AUTH_SIGNUP)}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
