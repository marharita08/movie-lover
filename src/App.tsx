import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "./components";
import { RouterKey } from "./const";
import { AuthGuard } from "./guards";
import { Dashboard } from "./pages/dashboard";
import { EmailVerification } from "./pages/email-verification";
import { Lists } from "./pages/lists";
import { Login } from "./pages/login";
import { MovieDetails } from "./pages/movie-details";
import { NotFound } from "./pages/not-found";
import { ResetPassword } from "./pages/reset-password";
import { Signup } from "./pages/signup";
import { UserProfile } from "./pages/user-profile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background text-foreground min-h-screen">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route
              path={RouterKey.DASHBOARD}
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path={RouterKey.LISTS}
              element={
                <AuthGuard>
                  <Lists />
                </AuthGuard>
              }
            />
            <Route
              path={RouterKey.MOVIE_DETAILS}
              element={
                <AuthGuard>
                  <MovieDetails />
                </AuthGuard>
              }
            />
            <Route
              path={RouterKey.USER_PROFILE}
              element={
                <AuthGuard>
                  <UserProfile />
                </AuthGuard>
              }
            />
            <Route
              path={RouterKey.RESET_PASSWORD}
              element={<ResetPassword />}
            />
            <Route path={RouterKey.LOGIN} element={<Login />} />
            <Route path={RouterKey.SIGNUP} element={<Signup />} />
            <Route
              path={RouterKey.EMAIL_VERIFICATION}
              element={<EmailVerification />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
