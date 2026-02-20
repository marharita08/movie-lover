export const RouterKey = {
  DASHBOARD: "/",
  LISTS: "/lists",
  LOGIN: "/login",
  SIGNUP: "/signup",
  EMAIL_VERIFICATION: "/email-verification",
  USER_PROFILE: "/user-profile",
  RESET_PASSWORD: "/reset-password",
  MOVIE_DETAILS: "/movie/:id",
  TV_SHOW_DETAILS: "/tv/:id",
  CREATE_LIST: "/create-list",
  LIST: "/list/:id",
  PERSONS_ANALITICS: "/list/:id/:role",
} as const;
