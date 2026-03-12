import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Wrapper } from "./components";
import { RouterKey } from "./const";
import { AuthGuard } from "./guards";
import {
  AIChat,
  CreateList,
  Dashboard,
  EmailVerification,
  List,
  Lists,
  Login,
  MovieDetails,
  NotFound,
  Person,
  PersonsAnalytics,
  ResetPassword,
  Search,
  Signup,
  TVShowDetails,
  UserProfile,
} from "./pages";

const privateRoutes = [
  {
    path: RouterKey.LISTS,
    element: <Lists />,
  },
  {
    path: RouterKey.USER_PROFILE,
    element: <UserProfile />,
  },
  {
    path: RouterKey.CREATE_LIST,
    element: <CreateList />,
  },
  {
    path: RouterKey.LIST,
    element: <List />,
  },
  {
    path: RouterKey.PERSONS_ANALYTICS,
    element: <PersonsAnalytics />,
  },
  {
    path: RouterKey.CHAT,
    element: <AIChat />,
    wrapperClassName: "h-svh overflow-hidden",
    mainClassName: "h-full overflow-hidden",
  },
];

const publicRoutes = [
  {
    path: RouterKey.DASHBOARD,
    element: <Dashboard />,
    withWrapper: true,
  },
  {
    path: RouterKey.MOVIE_DETAILS,
    element: <MovieDetails />,
    withWrapper: true,
  },
  {
    path: RouterKey.TV_SHOW_DETAILS,
    element: <TVShowDetails />,
    withWrapper: true,
  },
  {
    path: RouterKey.PERSON,
    element: <Person />,
    withWrapper: true,
  },
  {
    path: RouterKey.SEARCH,
    element: <Search />,
    withWrapper: true,
  },
  {
    path: RouterKey.RESET_PASSWORD,
    element: <ResetPassword />,
    withWrapper: false,
  },
  {
    path: RouterKey.LOGIN,
    element: <Login />,
    withWrapper: false,
  },
  {
    path: RouterKey.SIGNUP,
    element: <Signup />,
    withWrapper: false,
  },
  {
    path: RouterKey.EMAIL_VERIFICATION,
    element: <EmailVerification />,
    withWrapper: false,
  },
];

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AuthGuard>
                <Wrapper
                  wrapperClassName={route.wrapperClassName}
                  mainClassName={route.mainClassName}
                >
                  {route.element}
                </Wrapper>
              </AuthGuard>
            }
          />
        ))}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.withWrapper ? (
                <Wrapper>{route.element}</Wrapper>
              ) : (
                route.element
              )
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
