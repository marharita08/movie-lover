import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouterKey } from "./const";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Login } from "./pages/login/Login";
import { Signup } from "./pages/signup/Signup";
import { Toaster } from "./components/ui/Toaster";
import { EmailVerification } from "./pages/email-verification/EmailVerification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background text-foreground min-h-screen">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path={RouterKey.DASHBOARD} element={<Dashboard />} />
            <Route path={RouterKey.LOGIN} element={<Login />} />
            <Route path={RouterKey.SIGNUP} element={<Signup />} />
            <Route
              path={RouterKey.EMAIL_VERIFICATION}
              element={<EmailVerification />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
