import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster, TooltipProvider, Wrapper } from "./components";
import { RouterKey } from "./const";
import { AuthGuard } from "./guards";
import { CreateList } from "./pages/create-list/CreateList";
import { Dashboard } from "./pages/dashboard";
import { EmailVerification } from "./pages/email-verification";
import { List } from "./pages/list";
import { Lists } from "./pages/lists";
import { Login } from "./pages/login";
import { MovieDetails } from "./pages/movie-details";
import { NotFound } from "./pages/not-found";
import { Person } from "./pages/person";
import { PersonsAnalytics } from "./pages/persons-analytics";
import { ResetPassword } from "./pages/reset-password";
import { Search } from "./pages/search";
import { Signup } from "./pages/signup";
import { TVShowDetails } from "./pages/tv-show-details";
import { UserProfile } from "./pages/user-profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-background text-foreground min-h-screen">
          <Toaster />
          <BrowserRouter>
            <Routes>
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <AuthGuard>
                      <Wrapper>{route.element}</Wrapper>
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
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
