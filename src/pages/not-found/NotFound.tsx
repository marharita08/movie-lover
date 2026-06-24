import { Link } from "react-router-dom";

import { Button, Sphere } from "@/components";
import { RouterKey, TranslationKey } from "@/const";
import { useTranslation } from "@/hooks";

const getRandomDescriptionKey = () => {
  const keys = [
    TranslationKey.NOT_FOUND_DESC_1,
    TranslationKey.NOT_FOUND_DESC_2,
    TranslationKey.NOT_FOUND_DESC_3,
    TranslationKey.NOT_FOUND_DESC_4,
    TranslationKey.NOT_FOUND_DESC_5,
    TranslationKey.NOT_FOUND_DESC_6,
    TranslationKey.NOT_FOUND_DESC_7,
    TranslationKey.NOT_FOUND_DESC_8,
    TranslationKey.NOT_FOUND_DESC_9,
  ];
  return keys[Math.floor(Math.random() * keys.length)];
};

export const NotFound = () => {
  const { t } = useTranslation();
  const descriptionKey = getRandomDescriptionKey();

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-28 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <main className="bg-card w-full max-w-125 rounded-xl p-8 shadow-md">
        <h1 className="mb-6 text-center text-5xl font-bold">404</h1>

        <h2 className="mb-2 text-center text-xl font-bold">
          {t(TranslationKey.NOT_FOUND_PAGE_TITLE)}
        </h2>
        <p className="text-muted-foreground text-center">{t(descriptionKey)}</p>
        <Button className="mt-6 w-full" asChild>
          <Link to={RouterKey.DASHBOARD}>
            {t(TranslationKey.NOT_FOUND_GO_HOME)}
          </Link>
        </Button>
      </main>
    </div>
  );
};
