import { create } from "zustand";
import { persist } from "zustand/middleware";

import { StorageKey } from "@/const";

interface AccessTokenState {
  accessToken?: string;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
}

export const useAccessTokenStore = create<AccessTokenState>()(
  persist(
    (set) => ({
      accessToken: undefined,

      setAccessToken: (token: string) => set({ accessToken: token }),
      removeAccessToken: () => set({ accessToken: undefined }),
    }),
    {
      name: StorageKey.ACCESS_TOKEN,
    },
  ),
);
