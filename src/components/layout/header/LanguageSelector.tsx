import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import {
  Language,
  languageToLabel,
  languageToShort,
  TranslationKey,
} from "@/const";
import { useCurrentUser, useTranslation, useUpdateUser } from "@/hooks";
import { useLanguageStore } from "@/store/language.store";

export const LanguageSelector = () => {
  const { data: user } = useCurrentUser();
  const { language, setLanguage } = useLanguageStore();
  const updateUserMutation = useUpdateUser();
  const { t } = useTranslation();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (user) {
      updateUserMutation.mutate({ language: newLang });
    }
  };

  return (
    <div className="w-18 sm:w-40">
      <Select
        value={language}
        onValueChange={(val) => handleLanguageChange(val as Language)}
      >
        <SelectTrigger shortLabel={languageToShort[language]}>
          <SelectValue placeholder={t(TranslationKey.LOADING)} />
        </SelectTrigger>
        <SelectContent viewportClassName="min-w-fit max-w-none w-auto">
          {Object.values(Language).map((lang) => (
            <SelectItem key={lang} value={lang}>
              <div className="flex items-center gap-2">
                <span className="font-bold">{languageToShort[lang]}</span>
                <span>{t(languageToLabel[lang])}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
