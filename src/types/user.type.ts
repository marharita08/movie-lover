import { Language } from "@/const";

export type User = {
  id: string;
  name: string;
  email: string;
  language: Language;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  lastLoginAt: Date;
  lastActiveAt: Date;
};
