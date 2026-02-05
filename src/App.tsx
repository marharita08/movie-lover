import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouterKey } from "./const";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Login } from "./pages/login/Login";
import { Signup } from "./pages/signup/Signup";
import { Toaster } from "./components/ui/Toaster";
import { EmailVerification } from "./pages/email-verification/EmailVerification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuard } from "./guards/AuthGuard";
import { NotFound } from "./pages/not-found/NotFound";
import { Lists } from "./pages/lists/Lists";

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
