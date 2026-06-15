import { TranslationKey, translations } from "@/const";
import { useLanguageStore } from "@/store/language.store";

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t };
};
