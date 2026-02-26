import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthenticatedLayout, Toaster, TooltipProvider } from "./components";
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
import { Signup } from "./pages/signup";
import { TVShowDetails } from "./pages/tv-show-details";
import { UserProfile } from "./pages/user-profile";

const queryClient = new QueryClient();

const privateRoutes = [
  {
    path: RouterKey.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: RouterKey.LISTS,
    element: <Lists />,
  },
  {
    path: RouterKey.MOVIE_DETAILS,
    element: <MovieDetails />,
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
    path: RouterKey.TV_SHOW_DETAILS,
    element: <TVShowDetails />,
  },
  {
    path: RouterKey.PERSON,
    element: <Person />,
  },
];

const publicRoutes = [
  {
    path: RouterKey.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    path: RouterKey.LOGIN,
    element: <Login />,
  },
  {
    path: RouterKey.SIGNUP,
    element: <Signup />,
  },
  {
    path: RouterKey.EMAIL_VERIFICATION,
    element: <EmailVerification />,
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
                      <AuthenticatedLayout>{route.element}</AuthenticatedLayout>
                    </AuthGuard>
                  }
                />
              ))}
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
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
