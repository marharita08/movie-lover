import { TranslationKey } from "./translations/keys";

export const PersonRole = {
  DIRECTOR: "director",
  ACTOR: "actor",
} as const;

export type PersonRole = (typeof PersonRole)[keyof typeof PersonRole];

export const personRoleMap: Record<PersonRole, TranslationKey> = {
  [PersonRole.DIRECTOR]: TranslationKey.PERSON_ROLE_DIRECTORS,
  [PersonRole.ACTOR]: TranslationKey.PERSON_ROLE_ACTORS,
};
