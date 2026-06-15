import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Language, StorageKey } from "@/const";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: Language.ENGLISH,

      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: StorageKey.LANGUAGE,
    },
  ),
);
