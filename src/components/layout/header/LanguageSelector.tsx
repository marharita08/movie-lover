import { LanguagesIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Language, languageToLabel, TranslationKey } from "@/const";
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
    <div className="w-40">
      <Select
        value={language}
        onValueChange={(val) => handleLanguageChange(val as Language)}
      >
        <SelectTrigger startIcon={<LanguagesIcon className="h-4 w-4" />}>
          <SelectValue placeholder={t(TranslationKey.LOADING)} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Language).map((lang) => (
            <SelectItem key={lang} value={lang}>
              {t(languageToLabel[lang])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
