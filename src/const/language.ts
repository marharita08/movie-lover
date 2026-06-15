import { TranslationKey } from "./translations/keys";

export const Language = {
  ENGLISH: "en-US",
  UKRAINIAN: "uk-UA",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const languageToLabel = {
  [Language.ENGLISH]: TranslationKey.LANG_EN,
  [Language.UKRAINIAN]: TranslationKey.LANG_UK,
} as const;
