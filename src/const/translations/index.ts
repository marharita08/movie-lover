import { Language } from "../language";
import { en } from "./en";
import { TranslationKey } from "./keys";
import { uk } from "./uk";

export * from "./keys";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  [Language.ENGLISH]: en,
  [Language.UKRAINIAN]: uk,
};
