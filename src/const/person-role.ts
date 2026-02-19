export const PersonRole = {
  DIRECTOR: "director",
  ACTOR: "actor",
} as const;

export type PersonRole = (typeof PersonRole)[keyof typeof PersonRole];

export const personRoleMap = {
  [PersonRole.DIRECTOR]: "Directors",
  [PersonRole.ACTOR]: "Actors",
};
